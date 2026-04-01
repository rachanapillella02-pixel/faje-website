import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const screenshotFile = formData.get('screenshot') as File | null;
        const orderDataStr = formData.get('orderData') as string | null;

        if (!screenshotFile || !orderDataStr) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        const orderData = JSON.parse(orderDataStr);
        
        // Convert the File object to a Buffer for Nodemailer
        const arrayBuffer = await screenshotFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Configure Nodemailer transporter
        // You MUST add EMAIL_USER and EMAIL_PASS to your .env.local file
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Format order items for readability
        const itemsList = orderData.items.map((item: { quantity: number; name: string; size: string; price: number }) => 
            `- ${item.quantity}x ${item.name} (Size: ${item.size}) - ₹${item.price.toLocaleString('en-IN')}`
        ).join('\n');

        const customerText = orderData.customer ? `Customer Details:
Name: ${orderData.customer.name}
Email: ${orderData.customer.email}
Phone: ${orderData.customer.phone}
Delivery Address: ${orderData.customer.address}
` : '';

        const pricingText = `Subtotal: ₹${(orderData.subtotal || orderData.total).toLocaleString('en-IN')}
Delivery Charge: ₹${(orderData.deliveryCharge || 99).toLocaleString('en-IN')}${orderData.couponCode ? `\nCoupon (${orderData.couponCode}): -₹${(orderData.couponDiscount || 0).toLocaleString('en-IN')}` : ''}
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
                }
            ]
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
