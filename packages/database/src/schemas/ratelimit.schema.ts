import mongoose, { Schema, model, models, type Document, type Model } from "mongoose";

// ---------------------------------------------------------------------------
// RateLimit Collection
// ---------------------------------------------------------------------------
// A lightweight sliding-window rate-limit store per sessionId.
// Stored in MongoDB so it works across serverless function instances
// without a dedicated Redis layer. For high-throughput systems, replace
// with Redis — the interface stays the same.
//
// Design:
//   - One document per (sessionId, action) pair.
//   - `tokens` is decremented on each request.
//   - TTL index auto-removes documents after `windowSeconds`.
// ---------------------------------------------------------------------------

export type RateLimitAction =
  | "send_message"
  | "create_chat"
  | "auth_attempt"
  | "file_upload";

export interface IRateLimit extends Document {
  sessionId: string;
  userId?: mongoose.Types.ObjectId;
  action: RateLimitAction;

  /** Number of remaining allowed requests in this window */
  tokens: number;

  /** Total allowed per window */
  limit: number;

  /** Window size in seconds */
  windowSeconds: number;

  /** Resets at this time — also used by the TTL index */
  resetsAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>(
  {
    sessionId: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    action: {
      type: String,
      enum: ["send_message", "create_chat", "auth_attempt", "file_upload"],
      required: true,
    },
    tokens: { type: Number, required: true, min: 0 },
    limit: { type: Number, required: true },
    windowSeconds: { type: Number, required: true },
    resetsAt: { type: Date, required: true },
  },
  {
    timestamps: true,
    collection: "rate_limits",
  }
);

// Unique constraint: one record per (sessionId, action)
RateLimitSchema.index({ sessionId: 1, action: 1 }, { unique: true });

// TTL: auto-delete after the window expires
RateLimitSchema.index({ resetsAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimit: Model<IRateLimit> =
  models.RateLimit ?? model<IRateLimit>("RateLimit", RateLimitSchema);
