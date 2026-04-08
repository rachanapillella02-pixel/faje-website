/**
 * Single source for checkout notification text (email + Google Sheet mirror).
 */

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
