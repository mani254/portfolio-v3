import crypto from 'crypto';
import { Request, Response } from 'express';
import { Otp, User } from 'database';
import sendMail from '../utils/sendMail';
import { generateOtpEmailTemplate } from '../utils/mailTemplates/otpTemplate';
import { logger } from '../utils/logger';

// ---------------------------------------------------------------------------
// OTP Controller
// ---------------------------------------------------------------------------

// ── Generate & send OTP ────────────────────────────────────────────────────
export const generateOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, type = 'email_verification' } = req.body as { email: string; type?: string };

        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Invalidate all unused OTPs for this email + type
        await Otp.updateMany({ email, type, isUsed: false }, { isUsed: true });

        // Generate cryptographically secure 6-digit code
        const otp = crypto.randomInt(100_000, 1_000_000).toString();

        logger.debug({ email, type, otpLength: otp.length }, '[generateOtp] generated');

        await Otp.create({
            email,
            otp,
            type,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });

        const html = generateOtpEmailTemplate(otp, user.name);
        await sendMail({
            to: email,
            subject: 'Your verification code',
            html,
            otp, // Pass explicitly for unambiguous logging
        });

        res.json({
            message: 'OTP sent successfully',
            data: { email, type, expiresIn: 600 },
        });
    } catch (err) {
        logger.error({ err }, '[generateOtp] failed');
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// ── Verify OTP ─────────────────────────────────────────────────────────────
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { email, otp, type = 'email_verification' } = req.body as {
        email: string;
        otp: string;
        type?: string;
    };
    try {

        if (!email || !otp) {
            res.status(400).json({ message: 'Email and OTP are required' });
            return;
        }

        const record = await Otp.findOne({
            email,
            otp,
            type,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        });

        if (!record) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        if (record.attempts >= record.maxAttempts) {
            res.status(400).json({ message: 'Maximum attempts exceeded. Request a new OTP.' });
            return;
        }

        // Mark used
        record.isUsed = true;
        await record.save();

        // Mark user email as verified
        if (type === 'email_verification') {
            await User.findOneAndUpdate({ email }, { emailVerified: true });
        }

        res.json({
            message: 'Email verified successfully',
            data: { email, type, verified: true },
        });
    } catch (err) {
        logger.error({ err, email }, '[verifyOtp] failed');
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
};

// ── Resend OTP ─────────────────────────────────────────────────────────────
export const resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, type = 'email_verification' } = req.body as { email: string; type?: string };

        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (type === 'email_verification' && user.emailVerified) {
            res.status(400).json({ message: 'Email is already verified' });
            return;
        }

        // Delegate — generateOtp handles invalidation + send
        await generateOtp(req, res);
    } catch (err) {
        logger.error({ err }, '[resendOtp] failed');
        res.status(500).json({ message: 'Failed to resend OTP' });
    }
};
