import mongoose from "mongoose";

// ---------------------------------------------------------------------------
// Singleton connection – safe for Next.js (avoids re-connecting across HMR)
// ---------------------------------------------------------------------------

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Attach to globalThis so HMR in dev does not create multiple connections
const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache: MongooseCache;
};

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = { conn: null, promise: null };
}

const cache = globalWithMongoose.mongooseCache;

/**
 * Returns a cached (or new) Mongoose connection.
 *
 * Usage:
 * ```ts
 * import { connectDB } from "database";
 * await connectDB();
 * ```
 *
 * Set `MONGODB_URI` in your environment variables.
 */
export async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable in .env.local"
    );
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export { mongoose };
