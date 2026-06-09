// ---------------------------------------------------------------------------
// Server entry point
// ---------------------------------------------------------------------------
// Boot order (critical — do NOT reorder):
//   1. Connect MongoDB   → must be ready before any socket/HTTP handler runs
//   2. Start HTTP server → only after DB is connected
//   3. Init vector store → non-blocking background task after server is up
// ---------------------------------------------------------------------------

import 'dotenv/config';
import http from 'http';
import app from './app';
import './config/env';
import { env } from './config/env';
import { connectDB } from 'database';
import { createSocketServer } from './sockets';
import { disconnectRedis } from './utils/redis';
import { buildVectorStore } from './ai/retriever';

const PORT = env.PORT;

// Hoist these so the shutdown handler can reference them
let httpServer: http.Server;
let io: ReturnType<typeof createSocketServer>;

// ---------------------------------------------------------------------------
// Graceful shutdown — must be defined before main() so signal handlers work
// ---------------------------------------------------------------------------
let isShuttingDown = false;

const shutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n[${signal}] Graceful shutdown initiated…`);

  io?.close(() => console.log('  ✓ Socket.IO closed'));

  httpServer?.close(async () => {
    console.log('  ✓ HTTP server closed');
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
process.on('SIGINT',  () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('[process] Unhandled rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[process] Uncaught exception:', err);
  shutdown('uncaughtException').catch(() => process.exit(1));
});

// ---------------------------------------------------------------------------
// Main boot sequence
// ---------------------------------------------------------------------------
async function main() {
  // ── 1. Connect MongoDB ───────────────────────────────────────────────────
  // Must complete BEFORE the HTTP server starts accepting connections.
  // socketAuth middleware queries the DB on every socket connection and
  // bufferCommands=false means Mongoose will throw immediately if not ready.
  console.log('[startup] Connecting to MongoDB...');
  await connectDB();
  console.log('[startup] ✓ MongoDB connected');

  // ── 2. Create HTTP + Socket.IO server ────────────────────────────────────
  httpServer = http.createServer(app);
  io = createSocketServer(httpServer);

  // ── 3. Start listening ────────────────────────────────────────────────────
  httpServer.listen(PORT, () => {
    console.log(`\n🚀 Server started`);
    console.log(`   HTTP    → http://localhost:${PORT}`);
    console.log(`   WS      → ws://localhost:${PORT}`);
    console.log(`   Health  → http://localhost:${PORT}/health\n`);

    // ── 4. Init vector store (non-blocking — server is already up) ──────────
    buildVectorStore()
      .then(() => console.log('[startup] ✓ Vector store ready'))
      .catch((err) => console.error('[startup] Vector store init failed:', err));
  });
}

main().catch((err) => {
  console.error('[startup] Fatal error during boot:', err);
  process.exit(1);
});

export { io };
