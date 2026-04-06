import mongoose, { Schema, model, models, type Document, type Model } from "mongoose";

// ---------------------------------------------------------------------------
// Session Collection
// ---------------------------------------------------------------------------
// Tracks every visitor — anonymous or logged-in.
// `sessionId` is the single source of truth for identity (from localStorage).
// `userId` is optionally linked once the visitor authenticates.
// ---------------------------------------------------------------------------

export interface ISession extends Document {
  /** Opaque identifier stored in browser localStorage — always present */
  sessionId: string;

  /** Linked only after authentication */
  userId?: mongoose.Types.ObjectId;

  /** Client metadata — useful for analytics and abuse detection */
  metadata: {
    userAgent?: string;
    ip?: string;
    country?: string;
    timezone?: string;
  };

  /** Running count of messages sent this session (for rate-limiting) */
  messageCount: number;

  isActive: boolean;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    metadata: {
      userAgent: { type: String, default: null },
      ip: { type: String, default: null },
      country: { type: String, default: null },
      timezone: { type: String, default: null },
    },
    messageCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    lastSeenAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "sessions",
  }
);

// TTL index — auto-expire inactive sessions after 30 days
SessionSchema.index({ lastSeenAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

export const Session: Model<ISession> =
  models.Session ?? model<ISession>("Session", SessionSchema);
