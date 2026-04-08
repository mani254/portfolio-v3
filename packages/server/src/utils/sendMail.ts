import nodemailer from 'nodemailer';

// ---------------------------------------------------------------------------
// Mail utility — nodemailer SMTP transport
// ---------------------------------------------------------------------------
// Configure via environment variables. Falls back to console-log in local
// dev if no SMTP credentials are set (so OTPs are visible without email).
// ---------------------------------------------------------------------------

interface MailOptions {
    to: string;
    subject: string;
    html: string;
    otp?: string; // Optional: for unambiguous logging
}

const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

// Build transport — real SMTP or Ethereal-style dev logger
const transport = hasSmtp
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST!,
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.SMTP_USER!,
            pass: process.env.SMTP_PASS!,
        },
    })
    : null;

const sendMail = async ({ to, subject, html, otp }: MailOptions): Promise<void> => {
    if (!transport) {
        // Local dev fallback — use provided OTP or attempt to find one
        let loggedOtp = otp;
        if (!loggedOtp) {
            const otpMatch = html.match(/\b\d{6}\b/);
            loggedOtp = otpMatch ? otpMatch[0] : '(check HTML)';
        }

        console.log('\n─────────────────────────────────────');
        console.log(`[📧 DEV MAIL] To:      ${to}`);
        console.log(`[📧 DEV MAIL] Subject: ${subject}`);
        console.log(`[📧 DEV MAIL] OTP:     ${loggedOtp}`);
        console.log('─────────────────────────────────────\n');
        return;
    }

    await transport.sendMail({
        from: `"${process.env.SMTP_FROM_NAME ?? 'Portfolio'}" <${process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    });
};

export default sendMail;
