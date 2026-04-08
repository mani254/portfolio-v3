// ---------------------------------------------------------------------------
// Socket.IO authentication middleware
// ---------------------------------------------------------------------------
// Supports two identity paths:
//   1. Authenticated — client sends JWT via httpOnly cookies.
//   2. Anonymous — client sends a sessionId via handshake.auth (from localStorage).
//
// Both paths always resolve a Session document so every socket has an identity.
// Anonymous sessions can later be linked to a user via REST auth flow.
// ---------------------------------------------------------------------------

import { Session } from 'database';
import type { Socket } from 'socket.io';
import type { AuthenticatedSocket } from '../sockets/types';

function parseCookies(cookieHeader?: string): Record<string, string> {
    if (!cookieHeader) return {};
    return cookieHeader.split(';').reduce((acc: Record<string, string>, part) => {
        const [key, ...rest] = part.trim().split('=');
        if (key) acc[decodeURIComponent(key.trim())] = decodeURIComponent(rest.join('='));
        return acc;
    }, {});
}

export const socketAuthMiddleware = async (
    socket: Socket,
    next: (err?: Error) => void,
): Promise<void> => {
    const authedSocket = socket as AuthenticatedSocket;

    try {
        const sessionId =
            (socket.handshake.auth as Record<string, string>)?.sessionId ||
            (socket.handshake.query as Record<string, string>)?.sessionId;

        if (!sessionId || sessionId.trim() === '') {
            return next(new Error('UNAUTHORIZED: No valid credentials or sessionId provided'));
        }

        // Upsert session — create if new, update lastSeenAt if existing
        const session = await Session.findOneAndUpdate(
            { sessionId },
            {
                isActive: true,
                lastSeenAt: new Date(),
                $setOnInsert: {
                    sessionId,
                    metadata: {
                        userAgent: socket.handshake.headers['user-agent'],
                        ip: socket.handshake.address,
                    },
                },
            },
            { upsert: true, new: true },
        );

        authedSocket.session = session!;
        return next();
    } catch (err) {
        console.error('[socketAuth] Unexpected error:', err);
        return next(new Error('INTERNAL_ERROR'));
    }
};
