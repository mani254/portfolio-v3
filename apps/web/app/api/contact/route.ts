import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

async function sendMail({ subject, html, to }: { subject: string; html: string; to: string }) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "81f12a001@smtp-brevo.com",
        pass: process.env.MAIL_API_KEY,
      },
    });

    const mailOptions = {
      from: '"Manikanta" <manikantadev254@gmail.com>',
      to: to,
      subject: subject,
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.response);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

const generateContactFormHtml = ({ name, phoneNo, email, message, country, service, description, budget }: any) => {
  return `<div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
    <div style="font-size: 24px; color: #333; text-align: center; margin-bottom: 20px;">
      New Contact Form Submission
    </div>
    <div style="font-size: 16px; line-height: 1.6; color: #555;">
      <p><strong>Name:</strong> ${name || "Not provided"}</p>
      <p><strong>Phone:</strong> ${phoneNo || "Not provided"}</p>
      <p><strong>Email:</strong> ${email || "Not provided"}</p>
      <p><strong>Country:</strong> ${country || "Not provided"}</p>
      <p><strong>Service:</strong> ${service || "Not provided"}</p>
      <p><strong>Budget:</strong> ${budget || "Not provided"}</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
        ${message || description || "No message provided"}
      </div>
    </div>
    <div style="font-size: 12px; color: #aaa; text-align: center; margin-top: 30px;">
      This message was sent via your website's contact form.
    </div>
  </div>`;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phoneNo, email, message, country, service, description, budget } = body;

    const template = generateContactFormHtml({ name, phoneNo, email, message, country, service, description, budget });

    await sendMail({
      subject: 'Manidev Contact Form',
      html: template,
      to: 'manifreelancer25@gmail.com'
    });

    return NextResponse.json({ message: 'Form Submitted Successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('Error while sending contact form mail:', err.message);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
