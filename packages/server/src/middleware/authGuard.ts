import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';

export interface AuthRequest extends Request {
    userId?: string;
}

export const authGuard = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): void => {
    const token = req.cookies?.accessToken as string | undefined;

    if (!token) {
        return next(new UnauthorizedError('Authentication token missing'));
    }

    try {
        const payload = verifyAccessToken(token);
        req.userId = payload.id;
        next();
    } catch {
        next(new UnauthorizedError('Invalid or expired authentication token'));
    }
};
