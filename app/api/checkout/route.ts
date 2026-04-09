import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { validateCheckoutCustomer, validateCheckoutOrder } from '@/lib/checkoutPricing';
import { appendOrderToGoogleSheet, isGoogleSheetsOrderLogConfigured } from '@/lib/googleSheetsOrderLog';
import { buildCheckoutEmailBody, buildCheckoutEmailSubject } from '@/lib/orderNotificationContent';
import { sanitizeAttachmentFilename } from '@/lib/sanitize';

/** Reject huge uploads (DoS) and empty files. */
const MAX_PAYMENT_PROOF_BYTES = 10 * 1024 * 1024;

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

        if (!screenshotFile.size || screenshotFile.size > MAX_PAYMENT_PROOF_BYTES) {
            return NextResponse.json(
                {
                    error: !screenshotFile.size
                        ? 'Empty image file'
                        : 'Screenshot must be 10 MB or smaller',
                },
                { status: 400 },
            );
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('[checkout] EMAIL_USER / EMAIL_PASS are not set');
            return NextResponse.json({ error: 'Order email is not configured' }, { status: 503 });
        }

        let orderData: {
            subtotal: number;
            deliveryCharge: number;
            couponDiscount: number;
            couponCode?: string;
            total: number;
            items: { quantity: number; name: string; size: string; price: number }[];
            customer?: {
                name?: string;
                email?: string;
                phone?: string;
                address?: string;
                state?: string;
                pincode?: string;
            };
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

        const customer = orderData.customer!;
        const safeFilename = sanitizeAttachmentFilename(screenshotFile.name || 'payment_proof.jpg');

        const emailBody = buildCheckoutEmailBody({
            customer: {
                name: customer.name!,
                email: customer.email!,
                phone: customer.phone!,
                address: customer.address!,
            },
            subtotal: orderData.subtotal,
            deliveryCharge: orderData.deliveryCharge,
            couponDiscount: orderData.couponDiscount,
            couponCode: orderData.couponCode,
            total: orderData.total,
            items: orderData.items,
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: buildCheckoutEmailSubject(orderData.total),
            text: emailBody,
            attachments: [
                {
                    filename: safeFilename,
                    content: buffer,
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        if (isGoogleSheetsOrderLogConfigured()) {
            const sheetResult = await appendOrderToGoogleSheet({
                subtotal: orderData.subtotal,
                deliveryCharge: orderData.deliveryCharge,
                couponDiscount: orderData.couponDiscount,
                couponCode: orderData.couponCode,
                total: orderData.total,
                items: orderData.items,
                customer: {
                    name: customer.name!,
                    email: customer.email!,
                    phone: customer.phone!,
                    address: customer.address!,
                },
                paymentScreenshotFilename: safeFilename,
            });
            if (!sheetResult.ok) {
                console.warn('[checkout] Google Sheet log failed:', sheetResult.message);
            }
        }

        return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
