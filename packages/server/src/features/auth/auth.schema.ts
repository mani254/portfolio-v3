import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(50),
        email: z.string().email(),
        password: z.string().min(8).max(100),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

export const verifyOtpSchema = z.object({
    body: z.object({
        email: z.string().email(),
        otp: z.string().length(6),
        type: z.enum(['email_verification', 'password_reset']),
    }),
});

export const resendOtpSchema = z.object({
    body: z.object({
        email: z.string().email(),
        type: z.enum(['email_verification', 'password_reset']),
    }),
});
