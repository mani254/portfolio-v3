import mongoose, { Schema, model, models, type Document, type Model } from "mongoose";

// ---------------------------------------------------------------------------
// Chat Collection
// ---------------------------------------------------------------------------
// A "chat" is a conversation thread.
//
// Design decisions:
//  - Every chat is owned by a *session*, not necessarily a user.
//    This allows anonymous chats that can later be claimed by a user.
//  - `participants` stores both the visitor and the responder (AI / admin).
//  - `type` lets us distinguish direct user↔admin threads from AI-assistant threads.
//  - `lastMessage` is denormalised here for fast list rendering — no extra join.
// ---------------------------------------------------------------------------

export type ChatType = "ai_assistant" | "support" | "direct";
export type ChatStatus = "open" | "resolved" | "archived";

export interface IChat extends Document {
  /** The session that initiated this chat */
  sessionId: string;

  /** Populated once the visitor is authenticated */
  userId?: mongoose.Types.ObjectId;

  type: ChatType;
  status: ChatStatus;

  /** Human-readable title — auto-generated from first message */
  title?: string;

  /** Denormalised snapshot of the most recent message */
  lastMessage?: {
    content: string;
    sentAt: Date;
    role: "user" | "assistant" | "system";
  };

  /** Total messages — kept in sync by message-save hooks */
  messageCount: number;

  /** Whether the user has seen the latest reply */
  isRead: boolean;

  /** Arbitrary tags for filtering / search */
  tags?: string[];

  /** AI model used for this chat (if type === "ai_assistant") */
  aiModel?: string;

  metadata?: {
    /** Page URL where the chat was initiated */
    pageUrl?: string;
    referrer?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    type: {
      type: String,
      enum: ["ai_assistant", "support", "direct"],
      required: true,
      default: "ai_assistant",
    },
    status: {
      type: String,
      enum: ["open", "resolved", "archived"],
      default: "open",
      index: true,
    },
    title: { type: String, default: null, maxlength: 200 },
    lastMessage: {
      content: { type: String, default: null },
      sentAt: { type: Date, default: null },
      role: {
        type: String,
        enum: ["user", "assistant", "system"],
        default: null,
      },
    },
    messageCount: { type: Number, default: 0, min: 0 },
    isRead: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    aiModel: { type: String, default: null },
    metadata: {
      pageUrl: { type: String, default: null },
      referrer: { type: String, default: null },
    },
  },
  {
    timestamps: true,
    collection: "chats",
  }
);

// ---- Compound indexes ----

// Fetch all chats for a session (most recent first)
ChatSchema.index({ sessionId: 1, updatedAt: -1 });

// Fetch all chats for a logged-in user
ChatSchema.index({ userId: 1, updatedAt: -1 });

// Admin dashboard: filter by status
ChatSchema.index({ status: 1, updatedAt: -1 });

// Filter by type within a session
ChatSchema.index({ sessionId: 1, type: 1, status: 1 });

export const Chat: Model<IChat> =
  models.Chat ?? model<IChat>("Chat", ChatSchema);
