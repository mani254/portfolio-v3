import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import crypto from 'crypto';

// ---------------------------------------------------------------------------
// JWT helpers
// ---------------------------------------------------------------------------

export interface JwtPayload {
    id: string;
    jti?: string;
}

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};

export const signAccessToken = (userId: string): string => {
    return jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
};

export const signRefreshToken = (userId: string): string => {
    const jti = crypto.randomUUID();
    return jwt.sign({ id: userId, jti }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
