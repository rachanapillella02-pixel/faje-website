import { isValidIndianPincode, isValidIndianState } from '@/lib/indianAddress';

/**
 * Single source of truth for cart checkout: delivery rules, coupons, and phone format.
 * Used by the cart UI and /api/checkout validation.
 */

export const BASE_DELIVERY_CHARGE = 159;

/** Free delivery when subtotal is strictly greater than this (e.g. ₹3,000+). */
export const FREE_DELIVERY_SUBTOTAL_EXCEEDS = 2999;

/** Indian mobile in E.164: +91 and 10 digits, first digit 6–9 */
export const IN_MOBILE_E164 = /^\+91[6-9]\d{9}$/;

export const CHECKOUT_COUPONS: Record<string, { discount: number; label: string }> = {
    FAJE10: { discount: 0.1, label: '10% off on first order' },
    LAUNCH20: { discount: 0.2, label: '20% off on first order' },
};

export function deliveryChargeForSubtotal(subtotal: number): number {
    return subtotal > FREE_DELIVERY_SUBTOTAL_EXCEEDS ? 0 : BASE_DELIVERY_CHARGE;
}

export function getInPhoneDigits(phone: string): string {
    const d = phone.replace(/\D/g, '');
    if (d.startsWith('91')) return d.slice(2, 12);
    return d.slice(0, 10);
}

export function normalizeInPhoneDigits(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    let out = '';
    for (let i = 0; i < digits.length; i++) {
        const c = digits[i];
        if (i === 0) {
            if (/[6-9]/.test(c)) out += c;
        } else if (/\d/.test(c)) {
            out += c;
        }
    }
    return out.length ? `+91${out}` : '';
}

export type CheckoutLineItem = { price: number; quantity: number };

export function computeSubtotalFromLineItems(items: CheckoutLineItem[]): number {
    return items.reduce((s, i) => s + i.price * i.quantity, 0);
}

export function validateCheckoutOrder(data: {
    subtotal: number;
    deliveryCharge: number;
    couponDiscount: number;
    couponCode?: string;
    total: number;
    items: CheckoutLineItem[];
}): { ok: true } | { ok: false; message: string } {
    if (!Array.isArray(data.items) || data.items.length === 0) {
        return { ok: false, message: 'Invalid items' };
    }
    for (const i of data.items) {
        if (
            typeof i.price !== 'number' ||
            typeof i.quantity !== 'number' ||
            !Number.isFinite(i.price) ||
            !Number.isFinite(i.quantity) ||
            !Number.isInteger(i.quantity) ||
            i.quantity < 1 ||
            i.price < 0
        ) {
            return { ok: false, message: 'Invalid line item' };
        }
    }

    if (
        !Number.isFinite(data.subtotal) ||
        !Number.isFinite(data.deliveryCharge) ||
        !Number.isFinite(data.couponDiscount) ||
        !Number.isFinite(data.total)
    ) {
        return { ok: false, message: 'Invalid order amounts' };
    }

    const computedSubtotal = Math.round(computeSubtotalFromLineItems(data.items));
    if (Math.round(data.subtotal) !== computedSubtotal) {
        return { ok: false, message: 'Subtotal mismatch' };
    }

    const expectedDelivery = deliveryChargeForSubtotal(computedSubtotal);
    if (data.deliveryCharge !== expectedDelivery) {
        return { ok: false, message: 'Delivery charge mismatch' };
    }

    const code = data.couponCode?.trim();
    let expectedCouponDiscount = 0;
    if (code) {
        const entry = CHECKOUT_COUPONS[code.toUpperCase()];
        if (!entry) {
            return { ok: false, message: 'Invalid coupon code' };
        }
        expectedCouponDiscount = Math.round(computedSubtotal * entry.discount);
    }
    if (data.couponDiscount !== expectedCouponDiscount) {
        return { ok: false, message: 'Coupon discount mismatch' };
    }

    const expectedTotal = computedSubtotal + expectedDelivery - expectedCouponDiscount;
    if (Math.round(data.total) !== expectedTotal) {
        return { ok: false, message: 'Total mismatch' };
    }

    return { ok: true };
}

/** Total address length cap (common SMTP practice). */
export const EMAIL_MAX_LENGTH = 254;

/**
 * Well-formed ASCII email: local@domain.tld
 * - Single @, plausible DNS-style host, TLD segment at least 2 characters.
 * Pair with isValidEmailBasic() for consecutive-dot and edge checks.
 */
export const WELL_FORMED_EMAIL_REGEX =
    /^[a-zA-Z0-9][a-zA-Z0-9._%+-]{0,63}@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmailBasic(email: string): boolean {
    const s = email.trim();
    if (!s || s.length > EMAIL_MAX_LENGTH) return false;
    if (s.indexOf('@') !== s.lastIndexOf('@')) return false;
    const at = s.indexOf('@');
    if (at < 1) return false;
    const local = s.slice(0, at);
    const domain = s.slice(at + 1);
    if (!domain.includes('.')) return false;
    if (local.includes('..') || domain.includes('..')) return false;
    if (local.startsWith('.') || local.endsWith('.')) return false;
    if (domain.startsWith('.') || domain.endsWith('.') || domain.startsWith('-') || domain.endsWith('-')) {
        return false;
    }
    const tld = domain.slice(domain.lastIndexOf('.') + 1);
    if (
        tld.length < 2 ||
        !/^[a-zA-Z0-9-]+$/.test(tld) ||
        tld.startsWith('-') ||
        tld.endsWith('-')
    ) {
        return false;
    }
    return WELL_FORMED_EMAIL_REGEX.test(s);
}

export function isValidCustomerName(name: string): boolean {
    return name.trim().length >= 2;
}

export function validateCheckoutCustomer(customer: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    state?: string;
    pincode?: string;
}): { ok: true } | { ok: false; message: string } {
    if (!customer?.name?.trim() || !isValidCustomerName(customer.name)) {
        return { ok: false, message: 'Invalid customer name' };
    }
    if (!customer?.email?.trim() || !isValidEmailBasic(customer.email)) {
        return { ok: false, message: 'Invalid email' };
    }
    if (!customer?.phone || !IN_MOBILE_E164.test(customer.phone)) {
        return { ok: false, message: 'Invalid phone' };
    }
    if (!customer?.address?.trim()) {
        return { ok: false, message: 'Missing address' };
    }
    if (!customer?.state?.trim() || !isValidIndianState(customer.state)) {
        return { ok: false, message: 'Invalid state' };
    }
    if (!customer?.pincode?.trim() || !isValidIndianPincode(customer.pincode)) {
        return { ok: false, message: 'Invalid PIN code' };
    }
    return { ok: true };
}
