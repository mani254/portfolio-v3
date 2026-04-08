// ---------------------------------------------------------------------------
// Redis client — singleton with reconnection strategy
// ---------------------------------------------------------------------------
// Uses two separate clients:
//   - `redis`    → general-purpose (rate limiting, session cache, etc.)
//   - `redisPub` → Socket.IO adapter publisher
//   - `redisSub` → Socket.IO adapter subscriber
//
// The pub/sub clients are exported for use exclusively by the Socket.IO
// Redis adapter. Do NOT use them for other purposes.
// ---------------------------------------------------------------------------

import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';

function buildClient(name: string): Redis {
    const client = new Redis(REDIS_URL, {
        // Retry with exponential backoff up to 30 seconds
        retryStrategy: (times) => {
            const delay = Math.min(times * 200, 30_000);
            console.warn(`[redis:${name}] reconnect attempt #${times} in ${delay}ms`);
            return delay;
        },
        maxRetriesPerRequest: null, // Required for blocking commands
        enableReadyCheck: true,
        lazyConnect: false,
    });

    client.on('connect', () => console.log(`[redis:${name}] connected`));
    client.on('ready',   () => console.log(`[redis:${name}] ready`));
    client.on('error',   (err) => console.error(`[redis:${name}] error:`, err.message));
    client.on('close',   () => console.warn(`[redis:${name}] connection closed`));
    client.on('reconnecting', () => console.warn(`[redis:${name}] reconnecting…`));

    return client;
}

// General-purpose client
export const redis = buildClient('main');

// Dedicated pub/sub pair for Socket.IO Redis adapter
export const redisPub = buildClient('pub');
export const redisSub = buildClient('sub');

// ---------------------------------------------------------------------------
// Graceful shutdown — called from src/index.ts
// ---------------------------------------------------------------------------
export const disconnectRedis = async (): Promise<void> => {
    await Promise.allSettled([
        redis.quit(),
        redisPub.quit(),
        redisSub.quit(),
    ]);
    console.log('[redis] all clients disconnected');
};
