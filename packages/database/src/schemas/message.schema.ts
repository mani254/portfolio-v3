import mongoose, { Schema, model, models, type Document, type Model } from "mongoose";
import { Chat } from "./chat.schema";

// ---------------------------------------------------------------------------
// Message Collection
// ---------------------------------------------------------------------------
// Intentionally kept in its own collection — NOT embedded in Chat.
//
// Why a separate collection (not embedding)?
//   - Chats can grow to thousands of messages; MongoDB doc limit is 16 MB.
//   - Independent pagination / cursor-based loading.
//   - Atomic updates to individual messages (reactions, edits, soft-delete).
//   - Better index granularity (e.g. full-text search on content only).
//
// Pagination strategy:
//   - Use `cursor`-based pagination on `_id` (ObjectId is monotonic in time).
//   - Example: db.messages.find({ chatId, _id: { $lt: lastSeenId } }).limit(50)
// ---------------------------------------------------------------------------

export type MessageRole = "user" | "assistant" | "system";
export type MessageStatus = "sending" | "sent" | "delivered" | "failed";
export type ContentType = "text" | "markdown" | "image" | "file" | "code";

/** Structured attachment — stored as a sub-document */
export interface IAttachment {
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

/** Emoji-keyed reaction map: { "👍": ["userId1", "userId2"] } */
export type ReactionMap = Record<string, string[]>;

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  sessionId: string;

  /**
   * Populated for authenticated users; null for anonymous messages.
   * For AI messages, leave null and use role === "assistant".
   */
  userId?: mongoose.Types.ObjectId;

  role: MessageRole;
  contentType: ContentType;

  /** Raw message text / markdown / code snippet */
  content: string;

  /** Parsed / rendered version (optional — useful for cached markdown HTML) */
  contentRendered?: string;

  status: MessageStatus;

  attachments?: IAttachment[];

  /** `parentId` for threaded replies */
  parentId?: mongoose.Types.ObjectId;

  /** Emoji reactions keyed by emoji → array of userIds/sessionIds */
  reactions?: ReactionMap;

  /** AI-specific metadata */
  aiMetadata?: {
    model?: string;
    promptTokens?: number;
    completionTokens?: number;
    latencyMs?: number;
  };

  /** Soft-delete — keeps thread coherent */
  isDeleted: boolean;
  deletedAt?: Date;

  /** Whether the content was edited after sending */
  isEdited: boolean;
  editedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new Schema<IAttachment>(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const MessageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    contentType: {
      type: String,
      enum: ["text", "markdown", "image", "file", "code"],
      default: "text",
    },
    content: {
      type: String,
      required: true,
      maxlength: 32_000,
    },
    contentRendered: { type: String, default: null },
    status: {
      type: String,
      enum: ["sending", "sent", "delivered", "failed"],
      default: "sent",
    },
    attachments: {
      type: [AttachmentSchema],
      default: [],
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
      index: true,
    },
    reactions: {
      type: Schema.Types.Mixed,
      default: {},
    },
    aiMetadata: {
      model: { type: String, default: null },
      promptTokens: { type: Number, default: null },
      completionTokens: { type: Number, default: null },
      latencyMs: { type: Number, default: null },
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "messages",
  }
);

// ---- Compound indexes ----

// Primary: paginated message load for a chat (cursor on _id)
MessageSchema.index({ chatId: 1, _id: -1 });

// Filter non-deleted messages within a chat
MessageSchema.index({ chatId: 1, isDeleted: 1, _id: -1 });

// Threaded reply fetching
MessageSchema.index({ parentId: 1, _id: 1 }, { sparse: true });

// Full-text search on message content
MessageSchema.index({ content: "text" });

// ---- Post-save hook: keep Chat.lastMessage + messageCount in sync ----
MessageSchema.post("save", async function () {
  if (this.isDeleted) return;
  await Chat.findByIdAndUpdate(this.chatId, {
    $set: {
      lastMessage: {
        content:
          this.content.length > 150
            ? this.content.slice(0, 150) + "…"
            : this.content,
        sentAt: this.createdAt,
        role: this.role,
      },
    },
    $inc: { messageCount: 1 },
    updatedAt: new Date(),
  });
});

export const Message: Model<IMessage> =
  models.Message ?? model<IMessage>("Message", MessageSchema);
