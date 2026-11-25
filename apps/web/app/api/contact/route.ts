import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

interface ContactFormPayload {
  name?: string;
  phoneNo?: string;
  email?: string;
  message?: string;
  country?: string;
  service?: string;
  description?: string;
  budget?: string;
}

const sendMail = async ({ to, subject, html }: SendMailParams) => {
  try {
    const mailOptions = {
      from: '"Manikanta" <manikantadev254@gmail.com>',
      to: to,
      subject: subject,
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.info('Email sent successfully:', result.response);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const generateContactFormHtml = ({ name, phoneNo, email, message, country, service, description, budget }: ContactFormPayload) => {
  return `<div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
    <div style="font-size: 24px; color: #333; text-align: center; margin-bottom: 20px;">
      New Contact Form Submission
    </div>
    <div style="font-size: 16px; line-height: 1.6; color: #555;">
      <p><strong>Name:</strong> ${name || "Not provided"}</p>
      <p><strong>Phone:</strong> ${phoneNo || "Not provided"}</p>
      <p><strong>Email:</strong> ${email || "Not provided"}</p>
      <p><strong>Message:</strong> ${message || "Not provided"}</p>
      <p><strong>Country:</strong> ${country || "Not provided"}</p>
      <p><strong>Service:</strong> ${service || "Not provided"}</p>
      <p><strong>Description:</strong> ${description || "Not provided"}</p>
      <p><strong>Budget:</strong> ${budget || "Not provided"}</p>
    </div>
  </div>`;
};

export async function POST(req: NextRequest) {
  try {
    const { name, phoneNo, email, message, country, service, description, budget } = await req.json();

    const template = generateContactFormHtml({ name, phoneNo, email, message, country, service, description, budget });

    await sendMail({
      subject: 'Manidev Contact Form',
      html: template,
      to: 'manifreelancer25@gmail.com'
    });

    return NextResponse.json({ message: 'Form Submitted Successfully' }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error while sending contact form mail:', message);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
