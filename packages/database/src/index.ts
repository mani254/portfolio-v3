// ---------------------------------------------------------------------------
// database — public API
// ---------------------------------------------------------------------------
// Import from "database" in any app or package in this monorepo.
//
// Usage in Next.js API routes / Server Actions:
//
//   import { connectDB, Chat, Message, Session, IMessage } from "database";
//
//   export async function GET() {
//     await connectDB();
//     const chats = await Chat.find({ sessionId: "abc123" });
//     return Response.json(chats);
//   }
// ---------------------------------------------------------------------------

export { connectDB, mongoose } from "./connection";
export { ensureIndexes } from "./indexes";

// Models
export { Session } from "./schemas/session.schema";
export { User } from "./schemas/user.schema";
export { Chat } from "./schemas/chat.schema";
export { Message } from "./schemas/message.schema";
export { RateLimit } from "./schemas/ratelimit.schema";

// TypeScript interfaces
export type { ISession } from "./schemas/session.schema";
export type { IUser, UserRole, AuthProvider } from "./schemas/user.schema";
export type {
  IChat,
  ChatType,
  ChatStatus,
} from "./schemas/chat.schema";
export type {
  IMessage,
  MessageRole,
  MessageStatus,
  ContentType,
  IAttachment,
  ReactionMap,
} from "./schemas/message.schema";
export type {
  IRateLimit,
  RateLimitAction,
} from "./schemas/ratelimit.schema";
