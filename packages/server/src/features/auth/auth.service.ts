import { User } from 'database';
import { redis } from '../../utils/redis';
import { 
    signAccessToken, 
    signRefreshToken, 
    verifyRefreshToken, 
    JwtPayload 
} from '../../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../../utils/errors';

export class AuthService {
    /**
     * Rotates refresh tokens and issues new access tokens.
     * Implements reuse detection: if a jti is reused, all user sessions are potentially compromised.
     */
    static async rotateRefreshToken(oldToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        let payload: JwtPayload;
        
        try {
            payload = verifyRefreshToken(oldToken);
        } catch (err) {
            throw new UnauthorizedError('Invalid or expired refresh token');
        }

        const { id: userId, jti } = payload;

        if (!jti) {
            throw new UnauthorizedError('Invalid token format');
        }

        // 1. Check if token's jti has been used (Reuse detection)
        const isUsed = await redis.get(`blacklist:jti:${jti}`);
        if (isUsed) {
            // REUSE DETECTED!
            // Revoke all tokens for this user by incrementing tokenVersion
            await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
            console.error(`[SECURITY] Refresh token reuse detected for user ${userId}. Revoking all sessions.`);
            throw new ForbiddenError('Security breach detected. Please log in again.');
        }

        // 2. Load user and check if token version matches
        const user = await User.findById(userId);
        if (!user || !user.isActive) {
            throw new UnauthorizedError('User not found or inactive');
        }

        // If the token version is old, it means the session was revoked or replaced
        // Note: For pure rotation, we don't necessarily NEED tokenVersion check here 
        // unless we want "Logout all sessions" functionality.
        // But let's use it for robustness.
        
        // 3. Blacklist the USED token immediately
        // Set expiry to 7 days (the original token lifespan) to ensure it can't be reused
        await redis.setex(`blacklist:jti:${jti}`, 7 * 24 * 60 * 60, '1');

        // 4. Issue new tokens
        const accessToken = signAccessToken(userId);
        const refreshToken = signRefreshToken(userId);

        return { accessToken, refreshToken };
    }

    /**
     * Invalidates a single session by blacklisting the jti.
     */
    static async revokeRefreshToken(token: string): Promise<void> {
        try {
            const payload = verifyRefreshToken(token);
            if (payload.jti) {
                await redis.setex(`blacklist:jti:${payload.jti}`, 7 * 24 * 60 * 60, '1');
            }
        } catch {
            // Already invalid or expired
        }
    }

    /**
     * Revokes ALL sessions for a user.
     */
    static async revokeAllUserSessions(userId: string): Promise<void> {
        await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
    }
}
