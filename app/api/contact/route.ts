import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { name, email, phone, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, 
            replyTo: email,
            subject: `New Contact Message from ${name} | FAJÉ Website`,
            text: `
You have received a new contact form submission from the FAJÉ website.

-----------------------------------------
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
-----------------------------------------

Message:
${message}
            `,
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #5a2329; border-bottom: 2px solid #5a2329; padding-bottom: 10px; margin-top: 0;">New Contact Message</h2>
                    <p>You have received a new contact form submission from the FAJÉ website.</p>
                    
                    <div style="background: #fdfdfd; border-radius: 6px; padding: 15px; margin: 20px 0; border: 1px solid #eee;">
                        <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    </div>
                    
                    <h3 style="color: #444; margin-bottom: 10px;">Message:</h3>
                    <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #5a2329; white-space: pre-wrap;">${message}</div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Message sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Contact form submission error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
