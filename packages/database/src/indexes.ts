import mongoose from "mongoose";
import { Session } from "./schemas/session.schema";
import { User } from "./schemas/user.schema";
import { Chat } from "./schemas/chat.schema";
import { Message } from "./schemas/message.schema";
import { RateLimit } from "./schemas/ratelimit.schema";

// ---------------------------------------------------------------------------
// Index Definitions
// ---------------------------------------------------------------------------
// All indexes are declared on the Schema itself, but this helper lets you
// call `ensureIndexes()` at app bootstrap to push them to MongoDB eagerly
// (e.g. in a migration script or a one-time setup route).
//
// Mongoose auto-creates indexes at startup in dev; in production you should
// build them separately to avoid locking the collection during a deployment.
// ---------------------------------------------------------------------------

/**
 * Ensures all application indexes exist in MongoDB.
 * Safe to call multiple times — Mongoose skips already-existing indexes.
 *
 * @example
 * // In a one-off migration script:
 * import { connectDB, ensureIndexes } from "database";
 * await connectDB();
 * await ensureIndexes();
 */
export async function ensureIndexes(): Promise<void> {
  await Promise.all([
    Session.ensureIndexes(),
    User.ensureIndexes(),
    Chat.ensureIndexes(),
    Message.ensureIndexes(),
    RateLimit.ensureIndexes(),
  ]);
  console.log("[database] All indexes ensured ✓");
}

// ---------------------------------------------------------------------------
// Index Reference — for documentation purposes
// ---------------------------------------------------------------------------
//
// sessions
//   { sessionId: 1 }                              unique, default
//   { userId: 1 }                                 sparse
//   { lastSeenAt: 1 }                             TTL 30 days
//
// users
//   { email: 1 }                                  unique
//   { provider: 1, providerId: 1 }               sparse
//   { role: 1, isActive: 1 }
//
// chats
//   { sessionId: 1, updatedAt: -1 }              primary list query
//   { userId: 1, updatedAt: -1 }
//   { status: 1, updatedAt: -1 }                 admin dashboard
//   { sessionId: 1, type: 1, status: 1 }
//
// messages
//   { chatId: 1, _id: -1 }                       cursor pagination (primary)
//   { chatId: 1, isDeleted: 1, _id: -1 }
//   { parentId: 1, _id: 1 }                      sparse, threaded replies
//   { content: "text" }                           full-text search
//
// rate_limits
//   { sessionId: 1, action: 1 }                  unique
//   { resetsAt: 1 }                              TTL

export { mongoose };
