import { google } from 'googleapis';
import {
    buildCheckoutEmailBody,
    buildCheckoutEmailSubject,
    buildOrderItemsListEmailFormat,
    type OrderNotificationInput,
} from '@/lib/orderNotificationContent';
import {
    escapeGoogleSheetsCell,
    resolveGoogleServiceAccountPrivateKeyPem,
    resolveGoogleServiceAccountPrivateKeyPemFromBase64,
} from '@/lib/sanitize';

const SHEET_TAB = 'Sheet1';

/** Default spreadsheet from your Faje orders sheet (override with GOOGLE_SHEETS_SPREADSHEET_ID). */
const DEFAULT_SPREADSHEET_ID = '18CJR0upY_IhlhKgJBivPCX8NnlEMdygGwlx32tHP2iM';

/** Mirrors every field that appears in the order email, plus fulfillment columns. */
const HEADER_ROW = [
    'Timestamp (IST)',
    'Email subject',
    'Customer name',
    'Email',
    'Phone',
    'Delivery address',
    'Subtotal (₹)',
    'Delivery charge (₹)',
    'Coupon code',
    'Coupon discount (₹)',
    'Total paid (₹)',
    'Order items (same as email)',
    'Full email body (same as sent)',
    'Payment screenshot filename',
    'Email notification sent',
    'Product received',
];

export type OrderForSheet = OrderNotificationInput & {
    /** Original uploaded file name (email attachment). */
    paymentScreenshotFilename: string;
};

export function isGoogleSheetsOrderLogConfigured(): boolean {
    return Boolean(
        process.env.GOOGLE_SHEETS_CLIENT_EMAIL &&
            (process.env.GOOGLE_SHEETS_PRIVATE_KEY?.length ||
                process.env.GOOGLE_SHEETS_PRIVATE_KEY_BASE64?.length),
    );
}

function getSpreadsheetId(): string {
    return process.env.GOOGLE_SHEETS_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
}

function formatIstTimestamp(): string {
    return new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

/**
 * Ensures row 1 has headers (including "Product received" for manual fulfillment tracking).
 */
async function ensureHeaderRow(
    sheets: ReturnType<typeof google.sheets>,
    spreadsheetId: string,
): Promise<void> {
    const range = `${SHEET_TAB}!A1:P1`;

    const existing = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    const first = existing.data.values?.[0];
    if (first && first.length > 0 && String(first[0]).trim() !== '') {
        return;
    }

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [HEADER_ROW] },
    });
}

/**
 * Appends one order row after the email is sent. "Product received" is left blank for your team to fill in Sheets.
 */
export async function appendOrderToGoogleSheet(order: OrderForSheet): Promise<{ ok: true } | { ok: false; message: string }> {
    if (!isGoogleSheetsOrderLogConfigured()) {
        return { ok: false, message: 'Google Sheets not configured' };
    }

    const spreadsheetId = getSpreadsheetId();
    const b64 = process.env.GOOGLE_SHEETS_PRIVATE_KEY_BASE64?.trim();
    let privateKey: string | null = b64
        ? resolveGoogleServiceAccountPrivateKeyPemFromBase64(b64)
        : null;
    if (!privateKey) {
        privateKey = resolveGoogleServiceAccountPrivateKeyPem(process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? '');
    }
    if (!privateKey) {
        console.error(
            '[googleSheetsOrderLog] Invalid GOOGLE_SHEETS_PRIVATE_KEY. Paste the full private_key from the service account JSON on ONE line: GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n" (no space after =). Or set GOOGLE_SHEETS_PRIVATE_KEY_BASE64 to the base64-encoding of that PEM file.',
        );
        return { ok: false, message: 'Invalid private key format' };
    }

    const auth = new google.auth.JWT({
        email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const sentAt = formatIstTimestamp();
    const subject = buildCheckoutEmailSubject(order.total);
    const fullBody = buildCheckoutEmailBody(order);
    const itemsEmailFormat = buildOrderItemsListEmailFormat(order.items);

    const couponCodeCell = order.couponCode?.trim() ? order.couponCode.trim().toUpperCase() : '';
    const couponDiscountCell =
        order.couponDiscount > 0 ? order.couponDiscount.toLocaleString('en-IN') : '';

    const esc = escapeGoogleSheetsCell;
    const row = [
        esc(sentAt),
        esc(subject),
        esc(order.customer.name),
        esc(order.customer.email),
        esc(order.customer.phone),
        esc(order.customer.address),
        order.subtotal.toLocaleString('en-IN'),
        order.deliveryCharge.toLocaleString('en-IN'),
        esc(couponCodeCell),
        couponDiscountCell,
        order.total.toLocaleString('en-IN'),
        esc(itemsEmailFormat),
        esc(fullBody),
        esc(order.paymentScreenshotFilename),
        esc(`Yes (${sentAt})`),
        '', // Product received — update manually when fulfilled
    ];

    try {
        await ensureHeaderRow(sheets, spreadsheetId);
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${SHEET_TAB}!A:P`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [row] },
        });
        return { ok: true };
    } catch (e) {
        const msg = e instanceof Error ? e.message : 'Sheets append failed';
        console.error('[googleSheetsOrderLog]', msg);
        return { ok: false, message: msg };
    }
}
