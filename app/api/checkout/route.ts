import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { validateCheckoutCustomer, validateCheckoutOrder } from '@/lib/checkoutPricing';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const screenshotFile = formData.get('screenshot') as File | null;
        const orderDataStr = formData.get('orderData') as string | null;

        if (!screenshotFile || !orderDataStr) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        if (!screenshotFile.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Screenshot must be an image' }, { status: 400 });
        }

        let orderData: {
            subtotal: number;
            deliveryCharge: number;
            couponDiscount: number;
            couponCode?: string;
            total: number;
            items: { quantity: number; name: string; size: string; price: number }[];
            customer?: { name?: string; email?: string; phone?: string; address?: string };
        };

        try {
            orderData = JSON.parse(orderDataStr);
        } catch {
            return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
        }

        const orderCheck = validateCheckoutOrder({
            subtotal: orderData.subtotal,
            deliveryCharge: orderData.deliveryCharge,
            couponDiscount: orderData.couponDiscount,
            couponCode: orderData.couponCode,
            total: orderData.total,
            items: orderData.items,
        });
        if (!orderCheck.ok) {
            return NextResponse.json({ error: orderCheck.message }, { status: 400 });
        }

        const customerCheck = validateCheckoutCustomer(orderData.customer ?? {});
        if (!customerCheck.ok) {
            return NextResponse.json({ error: customerCheck.message }, { status: 400 });
        }

        const arrayBuffer = await screenshotFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const itemsList = orderData.items
            .map(
                (item: { quantity: number; name: string; size: string; price: number }) =>
                    `- ${item.quantity}x ${item.name} (Size: ${item.size}) - ₹${item.price.toLocaleString('en-IN')}`,
            )
            .join('\n');

        const customer = orderData.customer!;

        const customerText = `Customer Details:
Name: ${customer.name}
Email: ${customer.email}
Phone: ${customer.phone}
Delivery Address: ${customer.address}
`;

        const pricingText = `Subtotal: ₹${orderData.subtotal.toLocaleString('en-IN')}
Delivery Charge: ₹${orderData.deliveryCharge.toLocaleString('en-IN')}${orderData.couponCode ? `\nCoupon (${orderData.couponCode}): -₹${orderData.couponDiscount.toLocaleString('en-IN')}` : ''}
Total Paid: ₹${orderData.total.toLocaleString('en-IN')}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'contact@faje.com',
            subject: `FAJE: New Order & Payment - ₹${orderData.total.toLocaleString('en-IN')}`,
            text: `A new customer order and payment proof has been submitted.\n\n${customerText}\n${pricingText}\n\nOrder Items:\n${itemsList}\n\nPlease check the attached screenshot to verify the UPI payment.`,
            attachments: [
                {
                    filename: screenshotFile.name || 'payment_proof.jpg',
                    content: buffer,
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
