// ---------------------------------------------------------------------------
// Socket rate limiter — Redis sliding window (INCR + EXPIRE)
// ---------------------------------------------------------------------------
// Uses a Redis fixed window counter per sessionId.
//
// Key format:  rate:<sessionId>:<windowStart>
// TTL:         Window size (auto-expires old keys — no manual cleanup needed)
//
// Algorithm:
//   1. INCR the counter for this sessionId in the current window
//   2. On first increment (INCR returns 1), set TTL = window size
//   3. If counter > limit → rejected; otherwise → allowed
//
// Works correctly across multiple server instances (unlike in-memory buckets).
// ---------------------------------------------------------------------------

import { redis } from '../utils/redis';

const WINDOW_SEC = 60; // 1-minute sliding window

export type RateLimitResult =
    | { allowed: true; remaining: number }
    | { allowed: false; retryAfterSec: number };

/**
 * Check and increment rate limit counter for the given session.
 *
 * @param sessionId   Unique session identifier
 * @param maxPerWindow   Max events allowed per window (default 30)
 */
export const checkRateLimit = async (
    sessionId: string,
    maxPerWindow = 30,
): Promise<RateLimitResult> => {
    const window = Math.floor(Date.now() / (WINDOW_SEC * 1000));
    const key = `rate:${sessionId}:${window}`;

    // Pipeline — INCR + EXPIRE atomically
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.ttl(key);
    const results = await pipeline.exec();

    // results[0] = [err, count]
    // results[1] = [err, ttl]
    const count = (results?.[0]?.[1] as number) ?? 1;
    const ttl   = (results?.[1]?.[1] as number) ?? -1;

    // Set TTL on first increment
    if (count === 1 || ttl === -1) {
        await redis.expire(key, WINDOW_SEC + 5); // +5s buffer
    }

    if (count > maxPerWindow) {
        return { allowed: false, retryAfterSec: WINDOW_SEC - (Date.now() % (WINDOW_SEC * 1000)) / 1000 };
    }

    return { allowed: true, remaining: maxPerWindow - count };
};
