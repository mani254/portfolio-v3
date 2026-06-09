import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { User } from 'database';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

export interface AdminRequest extends Request {
    userId?: string;
}

/**
 * adminGuard — extends authGuard with an additional role check.
 * Only users with role === "admin" can pass through.
 */
export const adminGuard = async (
    req: AdminRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const token = req.cookies?.accessToken as string | undefined;

    if (!token) {
        return next(new UnauthorizedError('Authentication token missing'));
    }

    try {
        const payload = verifyAccessToken(token);
        req.userId = payload.id;

        // Verify role in DB — token alone is not enough
        const user = await User.findById(payload.id).select('role isActive');
        if (!user || !user.isActive) {
            return next(new UnauthorizedError('User not found or inactive'));
        }

        if (user.role !== 'admin') {
            return next(new ForbiddenError('Admin access required'));
        }

        next();
    } catch {
        next(new UnauthorizedError('Invalid or expired authentication token'));
    }
};
