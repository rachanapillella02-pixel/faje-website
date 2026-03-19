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
        const itemsList = orderData.items.map((item: any) => 
            `- ${item.quantity}x ${item.name} (Size: ${item.size}) - ₹${item.price.toLocaleString('en-IN')}`
        ).join('\n');

        const customerText = orderData.customer ? `Customer Details:
Name: ${orderData.customer.name}
Email: ${orderData.customer.email}
Phone: ${orderData.customer.phone}
Address: ${orderData.customer.address}
` : '';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Sending it to yourself
            subject: `FAJE: New Order & Payment - ₹${orderData.total.toLocaleString('en-IN')}`,
            text: `A new customer order and payment proof has been submitted.\n\n${customerText}\nTotal Paid: ₹${orderData.total.toLocaleString('en-IN')}\n\nOrder Items:\n${itemsList}\n\nPlease check the attached screenshot to verify the UPI payment.`,
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
