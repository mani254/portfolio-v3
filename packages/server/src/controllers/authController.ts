import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { User } from 'database';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { generateOtp } from './otpController';
import type { AuthRequest } from '../middleware/authGuard';
import { AuthService } from '../features/auth/auth.service';
import { UnauthorizedError, ForbiddenError, ConflictError, BadRequestError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

// ---------------------------------------------------------------------------
// Cookie options
// ---------------------------------------------------------------------------

const ACCESS_COOKIE = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000, // 15 minutes
};

const REFRESH_COOKIE = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Google OAuth config
const GOOGLE_CONFIG = {
    clientId:     process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri:  process.env.GOOGLE_REDIRECT_URI ?? 'http://localhost:8080/api/auth/google/callback',
};

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: 'Name, email and password are required' });
            return;
        }

        const existing = await User.findOne({ email });

        if (existing) {
            if (existing.provider === 'google') {
                res.status(400).json({ message: 'This email is linked to Google. Please use Google sign-in.' });
                return;
            }
            if (existing.emailVerified) {
                res.status(409).json({ message: 'Email already registered. Please log in.' });
                return;
            }
            // Unverified — update password hash and resend OTP
            existing.passwordHash = await bcrypt.hash(password, 12);
            await existing.save();
        } else {
            await User.create({
                name,
                email,
                provider: 'credentials',
                passwordHash: await bcrypt.hash(password, 12),
                emailVerified: false,
            });
        }

        // Send OTP (fire-and-forget style — errors are logged, not surfaced)
        try {
            await generateOtp(
                { body: { email, type: 'email_verification' } } as Request,
                { status: () => ({ json: () => {} }), json: () => {} } as unknown as Response,
            );
        } catch (otpErr) {
            logger.error({ err: otpErr, email }, '[register] OTP send failed');
        }

        res.status(201).json({
            message: 'Account created. Please verify your email with the code we sent.',
            data: { email, requiresVerification: true },
        });
    } catch (err) {
        next(err);
    }
};

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+passwordHash');

        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        if (user.provider === 'google' && !user.passwordHash) {
            res.status(400).json({ message: 'Please use Google sign-in for this account.' });
            return;
        }

        if (!user.passwordHash) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // Email not verified — resend OTP and ask the client to verify
        if (!user.emailVerified) {
            try {
                await generateOtp(
                    { body: { email, type: 'email_verification' } } as Request,
                    { status: () => ({ json: () => {} }), json: () => {} } as unknown as Response,
                );
            } catch (otpErr) {
                logger.error({ err: otpErr, email }, '[login] OTP send failed');
            }

            res.status(403).json({
                message: 'Please verify your email. A code has been sent.',
                data: { requiresVerification: true, email },
            });
            return;
        }

        if (!user.isActive) {
            res.status(403).json({ message: 'Your account has been deactivated.' });
            return;
        }

        const accessToken  = signAccessToken(user._id.toString());
        const refreshToken = signRefreshToken(user._id.toString());

        res
            .cookie('accessToken',  accessToken,  ACCESS_COOKIE)
            .cookie('refreshToken', refreshToken, REFRESH_COOKIE)
            .json({
                message: 'Logged in',
                data: {
                    _id:          user._id,
                    name:         user.name,
                    email:        user.email,
                    avatarUrl:    user.avatarUrl,
                    role:         user.role,
                    emailVerified: user.emailVerified,
                },
            });
    } catch (err) {
        next(err);
    }
};

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------
export const handleLogout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies?.refreshToken;
    if (token) {
        await AuthService.revokeRefreshToken(token);
    }
    res
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .json({ message: 'Logged out' });
};

// ---------------------------------------------------------------------------
// Get current user (protected)
// ---------------------------------------------------------------------------
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !user.isActive) {
            throw new NotFoundError('User not found');
        }
        res.json({
            data: {
                _id:           user._id,
                name:          user.name,
                email:         user.email,
                avatarUrl:     user.avatarUrl,
                role:          user.role,
                emailVerified: user.emailVerified,
                provider:      user.provider,
            },
        });
    } catch (err) {
        next(err);
    }
};

// ---------------------------------------------------------------------------
// Refresh access token
// ---------------------------------------------------------------------------
export const createRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies?.refreshToken as string | undefined;

    if (!token) {
        return next(new UnauthorizedError('No refresh token'));
    }

    try {
        const { accessToken, refreshToken } = await AuthService.rotateRefreshToken(token);

        res
            .cookie('accessToken', accessToken, ACCESS_COOKIE)
            .cookie('refreshToken', refreshToken, REFRESH_COOKIE)
            .json({ message: 'Token refreshed' });
    } catch (err) {
        next(err);
    }
};

// ---------------------------------------------------------------------------
// Google OAuth — initiate
// ---------------------------------------------------------------------------
export const initiateGoogleAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const state = encodeURIComponent(
            JSON.stringify({ redirectTo: req.query.redirectTo ?? '/' }),
        );

        const url =
            `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${GOOGLE_CONFIG.clientId}&` +
            `redirect_uri=${encodeURIComponent(GOOGLE_CONFIG.redirectUri)}&` +
            `response_type=code&` +
            `scope=openid%20email%20profile&` +
            `access_type=offline&` +
            `state=${state}`;

        res.json({ authUrl: url });
    } catch (err) {
        next(err);
    }
};

// ---------------------------------------------------------------------------
// Google OAuth — callback
// ---------------------------------------------------------------------------
export const handleGoogleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const FRONTEND = process.env.FRONTEND_URL ?? 'http://localhost:3000';

    try {
        const { code, state, error } = req.query;

        if (error || !code) {
            res.redirect(`${FRONTEND}/auth/google/callback?error=${error ?? 'no_code'}`);
            return;
        }

        // Exchange code → tokens
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id:     GOOGLE_CONFIG.clientId,
                client_secret: GOOGLE_CONFIG.clientSecret,
                code:          code as string,
                grant_type:    'authorization_code',
                redirect_uri:  GOOGLE_CONFIG.redirectUri,
            }),
        });

        if (!tokenRes.ok) {
            res.redirect(`${FRONTEND}/auth/google/callback?error=token_exchange_failed`);
            return;
        }

        const { access_token } = await tokenRes.json() as { access_token: string };

        // Fetch Google profile
        const profileRes = await fetch(
            `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`,
        );

        if (!profileRes.ok) {
            res.redirect(`${FRONTEND}/auth/google/callback?error=profile_fetch_failed`);
            return;
        }

        const googleUser = await profileRes.json() as {
            id: string;
            email: string;
            name: string;
            picture?: string;
            verified_email: boolean;
        };

        if (!googleUser.verified_email) {
            res.redirect(`${FRONTEND}/auth/google/callback?error=email_not_verified`);
            return;
        }

        // Upsert user
        let user = await User.findOne({ email: googleUser.email });

        if (user) {
            // Merge or update
            user.provider    = 'google';
            user.providerId  = googleUser.id;
            user.emailVerified = true;
            if (!user.avatarUrl && googleUser.picture) user.avatarUrl = googleUser.picture;
            if (!user.name     && googleUser.name)     user.name     = googleUser.name;
            await user.save();
        } else {
            user = await User.create({
                email:          googleUser.email,
                name:           googleUser.name,
                avatarUrl:      googleUser.picture ?? null,
                provider:       'google',
                providerId:     googleUser.id,
                emailVerified:  true,
            });
        }

        const accessToken  = signAccessToken(user._id.toString());
        const refreshToken = signRefreshToken(user._id.toString());

        // Parse redirect destination from state
        let redirectTo = '/';
        try {
            if (state) {
                const parsed = JSON.parse(decodeURIComponent(state as string));
                redirectTo = parsed.redirectTo ?? '/';
            }
        } catch { /* use default */ }

        res
            .cookie('accessToken',  accessToken,  ACCESS_COOKIE)
            .cookie('refreshToken', refreshToken, REFRESH_COOKIE)
            .redirect(`${FRONTEND}/auth/google/callback?success=true&redirectTo=${encodeURIComponent(redirectTo)}`);
    } catch (err) {
        console.error('[handleGoogleCallback]', err);
        res.redirect(`${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/auth/google/callback?error=auth_failed`);
    }
};
