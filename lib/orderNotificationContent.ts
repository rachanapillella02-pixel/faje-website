/**
 * Single source for checkout notification text (email + Google Sheet mirror).
 */

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export type OrderItemLine = { quantity: number; name: string; size: string; price: number };

export type OrderNotificationInput = {
    customer: { name: string; email: string; phone: string; address: string };
    subtotal: number;
    deliveryCharge: number;
    couponDiscount: number;
    couponCode?: string;
    total: number;
    items: OrderItemLine[];
};

export function buildOrderItemsListEmailFormat(items: OrderItemLine[]): string {
    return items
        .map(
            (item) =>
                `- ${item.quantity}x ${item.name} (Size: ${item.size}) - ₹${item.price.toLocaleString('en-IN')}`,
        )
        .join('\n');
}

export function buildCheckoutEmailSubject(total: number): string {
    return `FAJE: New Order & Payment - ₹${total.toLocaleString('en-IN')}`;
}

/**
 * Same plain-text body as sent via nodemailer (no attachment).
 */
export function buildCheckoutEmailBody(order: OrderNotificationInput): string {
    const customerText = `Customer Details:
Name: ${order.customer.name}
Email: ${order.customer.email}
Phone: ${order.customer.phone}
Delivery Address: ${order.customer.address}
`;

    const couponCodeDisplay = order.couponCode?.trim()
        ? order.couponCode.trim().toUpperCase()
        : '';
    const pricingText = `Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}
Delivery Charge: ₹${order.deliveryCharge.toLocaleString('en-IN')}${couponCodeDisplay ? `\nCoupon (${couponCodeDisplay}): -₹${order.couponDiscount.toLocaleString('en-IN')}` : ''}
Total Paid: ₹${order.total.toLocaleString('en-IN')}`;

    const itemsList = buildOrderItemsListEmailFormat(order.items);

    return `A new customer order and payment proof has been submitted.

${customerText}
${pricingText}

Order Items:
${itemsList}

Please check the attached screenshot to verify the UPI payment.`;
}

function emailLogoBlock(logoCid: string): string {
    return `<div style="text-align:center;margin:0 0 28px;">
  <img src="cid:${logoCid}" alt="FAJE" width="220" style="max-width:100%;height:auto;display:inline-block;" />
</div>`;
}

/** HTML body for merchant notification; `logoCid` must match nodemailer attachment `cid`. */
export function buildCheckoutEmailBodyHtml(order: OrderNotificationInput, logoCid: string): string {
    const couponCodeDisplay = order.couponCode?.trim()
        ? order.couponCode.trim().toUpperCase()
        : '';
    const pricingHtml = `Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}<br/>
Delivery charge: ₹${order.deliveryCharge.toLocaleString('en-IN')}${couponCodeDisplay ? `<br/>Coupon (${escapeHtml(couponCodeDisplay)}): -₹${order.couponDiscount.toLocaleString('en-IN')}` : ''}<br/>
<strong>Total paid: ₹${order.total.toLocaleString('en-IN')}</strong>`;

    const itemsHtml = order.items
        .map(
            (item) =>
                `<li>${item.quantity}× ${escapeHtml(item.name)} (Size: ${escapeHtml(item.size)}) — ₹${item.price.toLocaleString('en-IN')}</li>`,
        )
        .join('');

    return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:24px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.55;color:#2d2a2a;background:#fafafa;">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:28px 24px;border-radius:8px;border:1px solid #eee;">
    ${emailLogoBlock(logoCid)}
    <p style="margin:0 0 16px;">A new customer order and payment proof has been submitted.</p>
    <h2 style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#5a2329;margin:20px 0 8px;">Customer</h2>
    <p style="margin:0 0 16px;">
      <strong>Name:</strong> ${escapeHtml(order.customer.name)}<br/>
      <strong>Email:</strong> ${escapeHtml(order.customer.email)}<br/>
      <strong>Phone:</strong> ${escapeHtml(order.customer.phone)}<br/>
      <strong>Address:</strong><br/>${escapeHtml(order.customer.address).replace(/\n/g, '<br/>')}
    </p>
    <h2 style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#5a2329;margin:20px 0 8px;">Pricing</h2>
    <p style="margin:0 0 16px;">${pricingHtml}</p>
    <h2 style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#5a2329;margin:20px 0 8px;">Items</h2>
    <ul style="margin:0;padding-left:20px;">${itemsHtml}</ul>
    <p style="margin:24px 0 0;color:#555;font-size:14px;">Please check the attached screenshot to verify the UPI payment.</p>
  </div>
</body>
</html>`;
}

export function buildCustomerOrderConfirmationSubject(total: number): string {
    return `FAJE — Order received (₹${total.toLocaleString('en-IN')})`;
}

/**
 * Plain-text confirmation for the shopper after checkout succeeds (no attachment).
 */
export function buildCustomerOrderConfirmationBody(order: OrderNotificationInput): string {
    const itemsList = buildOrderItemsListEmailFormat(order.items);
    const couponCodeDisplay = order.couponCode?.trim()
        ? order.couponCode.trim().toUpperCase()
        : '';
    const pricingBlock = `Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}
Delivery: ₹${order.deliveryCharge.toLocaleString('en-IN')}${couponCodeDisplay ? `\nCoupon (${couponCodeDisplay}): -₹${order.couponDiscount.toLocaleString('en-IN')}` : ''}
Amount paid: ₹${order.total.toLocaleString('en-IN')}`;

    return `Hi ${order.customer.name},

Thank you for shopping with FAJE. We've received your order and payment details.

ORDER SUMMARY
${pricingBlock}

Items:
${itemsList}

DELIVERY ADDRESS
${order.customer.address}

Phone: ${order.customer.phone}

We're verifying your payment and will update you once it's confirmed. If you have any questions, reply to this email or write to us at contact@thefaje.com.

— FAJE
New Age Fashion`;
}

/** HTML confirmation for the shopper; `logoCid` must match nodemailer attachment `cid`. */
export function buildCustomerOrderConfirmationBodyHtml(order: OrderNotificationInput, logoCid: string): string {
    const couponCodeDisplay = order.couponCode?.trim()
        ? order.couponCode.trim().toUpperCase()
        : '';
    const pricingHtml = `Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}<br/>
Delivery: ₹${order.deliveryCharge.toLocaleString('en-IN')}${couponCodeDisplay ? `<br/>Coupon (${escapeHtml(couponCodeDisplay)}): -₹${order.couponDiscount.toLocaleString('en-IN')}` : ''}<br/>
<strong>Amount paid: ₹${order.total.toLocaleString('en-IN')}</strong>`;

    const itemsHtml = order.items
        .map(
            (item) =>
                `<li>${item.quantity}× ${escapeHtml(item.name)} (Size: ${escapeHtml(item.size)}) — ₹${item.price.toLocaleString('en-IN')}</li>`,
        )
        .join('');

    return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:24px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.55;color:#2d2a2a;background:#fafafa;">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:28px 24px;border-radius:8px;border:1px solid #eee;">
    ${emailLogoBlock(logoCid)}
    <p style="margin:0 0 16px;">Hi ${escapeHtml(order.customer.name)},</p>
    <p style="margin:0 0 16px;">Thank you for shopping with <strong>FAJE</strong>. We've received your order and payment details.</p>
    <h2 style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#5a2329;margin:20px 0 8px;">Order summary</h2>
    <p style="margin:0 0 16px;">${pricingHtml}</p>
    <h2 style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#5a2329;margin:20px 0 8px;">Items</h2>
    <ul style="margin:0;padding-left:20px;">${itemsHtml}</ul>
    <h2 style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#5a2329;margin:20px 0 8px;">Delivery address</h2>
    <p style="margin:0 0 16px;">${escapeHtml(order.customer.address).replace(/\n/g, '<br/>')}<br/><br/>Phone: ${escapeHtml(order.customer.phone)}</p>
    <p style="margin:0;color:#555;font-size:14px;">We're verifying your payment and will update you once it's confirmed. Questions? Reply to this email or write to <a href="mailto:contact@thefaje.com" style="color:#5a2329;">contact@thefaje.com</a>.</p>
    <p style="margin:24px 0 0;color:#5a2329;font-weight:600;">FAJE<br/><span style="font-weight:400;font-size:13px;color:#666;">New Age Fashion</span></p>
  </div>
</body>
</html>`;
}
