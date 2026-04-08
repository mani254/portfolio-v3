// ---------------------------------------------------------------------------
// Server entry point
// ---------------------------------------------------------------------------
// Single responsibility: create the HTTP server, attach Socket.IO, listen,
// and handle graceful shutdown of all connections (HTTP, Socket.IO, Redis, DB).
// ---------------------------------------------------------------------------

import 'dotenv/config';
import './config/env';
import http from 'http';
import app from './app';
import { createSocketServer } from './sockets';
import { disconnectRedis } from './utils/redis';
import { env } from './config/env';

const PORT = env.PORT;

const httpServer = http.createServer(app);
const io = createSocketServer(httpServer);

httpServer.listen(PORT, () => {
    console.log(`\n🚀 Server started`);
    console.log(`   HTTP    → http://localhost:${PORT}`);
    console.log(`   WS      → ws://localhost:${PORT}`);
    console.log(`   Health  → http://localhost:${PORT}/health\n`);
});

// ---------------------------------------------------------------------------
// Graceful shutdown — ensures in-flight requests finish, sockets close
// cleanly, and Redis connections are released before the process exits.
// ---------------------------------------------------------------------------
let isShuttingDown = false;

const shutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\n[${signal}] Graceful shutdown initiated…`);

    // 1. Stop accepting new socket connections
    io.close(() => console.log('  ✓ Socket.IO closed'));

    // 2. Close HTTP server (stop accepting new requests)
    httpServer.close(async () => {
        console.log('  ✓ HTTP server closed');

        // 3. Disconnect Redis clients
        await disconnectRedis();

        console.log('  ✓ Redis disconnected');
        console.log('[shutdown] complete — exiting\n');
        process.exit(0);
    });

    // Force kill after 15 seconds if shutdown hangs
    setTimeout(() => {
        console.error('[shutdown] timed out — forcing exit');
        process.exit(1);
    }, 15_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Log unhandled rejections (don't crash, but surface the error)
process.on('unhandledRejection', (reason) => {
    console.error('[process] Unhandled rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('[process] Uncaught exception:', err);
    shutdown('uncaughtException').catch(() => process.exit(1));
});

export { io };
