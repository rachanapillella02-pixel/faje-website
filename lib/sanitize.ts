/**
 * Hardening helpers for uploads and Google Sheets (formula / path injection).
 */

import { createPrivateKey } from 'node:crypto';

const MAX_ATTACHMENT_FILENAME_LENGTH = 200;

/**
 * Fixes common .env mistakes so OpenSSL can load the PEM (avoids DECODER routines::unsupported).
 * Use the `private_key` string from the Google service account JSON; in .env use \\n for line breaks.
 */
export function normalizeGoogleServiceAccountPrivateKey(raw: string): string {
    let k = raw.trim();
    if (
        (k.startsWith('"') && k.endsWith('"')) ||
        (k.startsWith("'") && k.endsWith("'"))
    ) {
        k = k.slice(1, -1);
    }
    k = k.replace(/\uFEFF/g, '');
    k = k.replace(/\r\n/g, '\n');
    for (let i = 0; i < 5; i++) {
        const next = k.replace(/\\n/g, '\n');
        if (next === k) break;
        k = next;
    }
    return k.trim();
}

/** Pulls a PKCS#8 PEM block out of messy pastes (extra text, broken .env lines). */
export function extractPkcs8PrivateKeyPemBlock(normalized: string): string | null {
    const m = normalized.match(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/);
    if (!m) return null;
    return m[0].replace(/\r\n/g, '\n').trim();
}

export function isValidGooglePrivateKeyPem(pem: string): boolean {
    if (!pem.includes('BEGIN PRIVATE KEY')) {
        return false;
    }
    try {
        createPrivateKey({ key: pem, format: 'pem' });
        return true;
    } catch {
        return false;
    }
}

/**
 * Normalizes env paste, extracts PEM block if present, validates with OpenSSL.
 */
export function resolveGoogleServiceAccountPrivateKeyPem(raw: string): string | null {
    const k = normalizeGoogleServiceAccountPrivateKey(raw);
    const extracted = extractPkcs8PrivateKeyPemBlock(k);
    const candidates = [extracted, k].filter((x): x is string => Boolean(x));
    for (const c of candidates) {
        if (isValidGooglePrivateKeyPem(c)) {
            return c;
        }
    }
    return null;
}

/** Use when the PEM is stored as base64 (e.g. one line in Vercel). Decode then resolve. */
export function resolveGoogleServiceAccountPrivateKeyPemFromBase64(b64: string): string | null {
    try {
        const decoded = Buffer.from(b64.trim(), 'base64').toString('utf8');
        return resolveGoogleServiceAccountPrivateKeyPem(decoded);
    } catch {
        return null;
    }
}

/** Strip path segments and dangerous patterns from uploaded file names. */
export function sanitizeAttachmentFilename(name: string): string {
    const base = name
        .replace(/[/\\]/g, '_')
        .replace(/\.\./g, '_')
        .replace(/^\.+/, '')
        .trim();
    const cut = base.slice(0, MAX_ATTACHMENT_FILENAME_LENGTH);
    return cut || 'payment_proof.jpg';
}

/**
 * Prevents spreadsheet formula injection when a cell starts with =, +, -, @, or tab.
 * @see https://owasp.org/www-community/attacks/CSV_Injection
 */
export function escapeGoogleSheetsCell(value: string): string {
    const s = String(value);
    if (/^[=+\-@\t\r]/.test(s)) {
        return `'${s.replace(/'/g, "''")}`;
    }
    return s;
}
