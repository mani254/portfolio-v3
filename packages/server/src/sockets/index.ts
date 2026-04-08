// ---------------------------------------------------------------------------
// Socket.IO server setup
// ---------------------------------------------------------------------------
// Single responsibility: configure the IO server, attach the Redis adapter
// (for horizontal scalability), register auth middleware, and wire up handlers.
// ---------------------------------------------------------------------------

import type { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { socketAuthMiddleware } from '../middleware/socketAuth';
import { registerChatSocket } from './registerChatSocket';
import { redisPub, redisSub } from '../utils/redis';
import type { AuthenticatedSocket } from './types';
import { env } from '../config/env';

export const createSocketServer = (httpServer: HTTPServer): SocketIOServer => {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: env.ALLOWED_ORIGINS,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
        },
        // Prefer WebSocket; fall back to polling for environments that block WS
        transports: ['websocket', 'polling'],
        // Connection health timings
        pingInterval: 25_000,
        pingTimeout: 60_000,
        // Increase max buffer (default 1MB) — useful for larger payloads
        maxHttpBufferSize: 2e6,
    });

    // ── Redis adapter — enables multi-instance pub/sub ─────────────────────
    // All io.to(room).emit(...) calls now fan out to every server instance.
    io.adapter(createAdapter(redisPub, redisSub));
    console.log('[socket.io] Redis adapter attached');

    // ── Global middleware: authentication + session resolution ─────────────
    io.use(socketAuthMiddleware);

    // ── Connection handler ─────────────────────────────────────────────────
    io.on('connection', (socket) => {
        registerChatSocket(socket as AuthenticatedSocket, io);
    });

    return io;
};
