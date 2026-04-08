// ---------------------------------------------------------------------------
// Chat socket event handlers
// ---------------------------------------------------------------------------
// Events (Client → Server):
//   chat:init     — fetch or create the single persistent chat
//   chat:clear    — reset chat history
//   chat:message  — send a message; triggers AI reply with typing indicator
//   chat:typing   — broadcast typing status to room participants
//
// Events (Server → Client):
//   chat:created        — new chat created
//   chat:history        — message history on join
//   chat:message:new    — a user message was persisted
//   chat:ai:thinking    — AI is generating a response (show thinking indicator)
//   chat:ai:done        — AI response complete, full content delivered
//   chat:ai:error       — AI generation failed
//   chat:typing         — relayed typing indicator
//   session:token       — new access token after refresh
//   error               — { code, message }
// ---------------------------------------------------------------------------

import type { Server } from 'socket.io';
import { Chat, Message, Session } from 'database';
import type { AuthenticatedSocket } from './types';
import { checkRateLimit } from '../middleware/rateLimiter';
import { redis } from '../utils/redis';
import type { ChatType } from 'database';
import { logger } from '../utils/logger';
import { env } from '../config/env';

// ---------------------------------------------------------------------------
// AI response generator
// ---------------------------------------------------------------------------
// Calls Groq SDK and returns the full response string.
// When enabled, the socket already emits chat:ai:thinking before calling this.
// ---------------------------------------------------------------------------
async function generateAIResponse(
    _content: string,
    _model: string,
): Promise<string> {
    // TODO: Replace with real Groq SDK call:
    //
    // import Groq from 'groq-sdk';
    // import { getGrockApiKey } from '../utils/env';
    //
    // const groq = new Groq({ apiKey: getGrockApiKey() });
    // const completion = await groq.chat.completions.create({
    //     model: _model,
    //     messages: [{ role: 'user', content: _content }],
    // });
    // return completion.choices[0]?.message?.content ?? '';

    // Placeholder — simulates thinking delay
    await new Promise((r) => setTimeout(r, 1500));
    return 'I am your AI assistant. (Groq integration pending — replace the placeholder in registerChatSocket.ts)';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function emitError(socket: AuthenticatedSocket, code: string, message: string): void {
    socket.emit('error', { code, message });
}

function chatOwnerQuery(chatId: string, sessionId: string) {
    return { _id: chatId, sessionId };
}

const AI_LOCK_KEY = (chatId: string) => `ai:lock:${chatId}`;

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------
export const registerChatSocket = (socket: AuthenticatedSocket, io: Server): void => {
    const { session } = socket;
    const sessionId = session.sessionId;

    // ── chat:init ──────────────────────────────────────────────────────────
    socket.on(
        'chat:init',
        async (_payload: unknown, ack?: (res: unknown) => void) => {
            try {
                let chat = await Chat.findOne({ sessionId, type: 'ai_assistant' }).lean();

                let chatId: string;
                if (!chat) {
                    const newChat = await Chat.create({
                        sessionId,
                        type: 'ai_assistant',
                    });
                    chatId = newChat._id.toString();
                } else {
                    chatId = chat._id.toString();
                }

                socket.join(chatId);

                const messages = await Message.find({ chatId, isDeleted: false })
                    .sort({ _id: -1 })
                    .limit(50)
                    .lean();

                socket.emit('chat:history', { chatId, messages: messages.reverse() });
                ack?.({ ok: true, chatId });
            } catch (err) {
                logger.error({ err, sessionId }, '[chat:init] failed');
                emitError(socket, 'CHAT_INIT_FAILED', 'Could not initialize chat.');
                ack?.({ ok: false, error: 'CHAT_INIT_FAILED' });
            }
        },
    );

    // ── chat:clear ─────────────────────────────────────────────────────────
    socket.on(
        'chat:clear',
        async (payload: { chatId: string }, ack?: (res: unknown) => void) => {
            const { chatId } = payload;
            try {
                const chat = await Chat.findOne(chatOwnerQuery(chatId, sessionId));

                if (!chat) {
                    ack?.({ ok: false, error: 'CHAT_NOT_FOUND' });
                    return;
                }

                await Message.deleteMany({ chatId });
                chat.messageCount = 0;
                chat.lastMessage = undefined;
                await chat.save();

                ack?.({ ok: true });
                socket.to(chatId).emit('chat:cleared', { chatId });
            } catch (err) {
                logger.error({ err, chatId, sessionId }, '[chat:clear] failed');
                ack?.({ ok: false, error: 'CHAT_CLEAR_FAILED' });
            }
        },
    );

    // ── chat:message ───────────────────────────────────────────────────────
    socket.on(
        'chat:message',
        async (
            payload: { chatId: string; content: string; contentType?: string; clientId?: string },
            ack?: (res: unknown) => void,
        ) => {
            const { chatId, content, contentType = 'text', clientId } = payload;
            try {

                // Rate limit
                const limit      = 20;
                const rateResult = await checkRateLimit(sessionId, limit);
                if (!rateResult.allowed) {
                    const msg = `Rate limit exceeded. Retry in ${Math.ceil(rateResult.retryAfterSec)}s.`;
                    emitError(socket, 'RATE_LIMITED', msg);
                    ack?.({ ok: false, error: 'RATE_LIMITED', retryAfterSec: rateResult.retryAfterSec });
                    return;
                }

                // Validate input
                if (!content?.trim()) {
                    emitError(socket, 'EMPTY_MESSAGE', 'Message cannot be empty.');
                    ack?.({ ok: false, error: 'EMPTY_MESSAGE' });
                    return;
                }
                if (content.length > 32_000) {
                    emitError(socket, 'MESSAGE_TOO_LONG', 'Message exceeds maximum length.');
                    ack?.({ ok: false, error: 'MESSAGE_TOO_LONG' });
                    return;
                }

                // Ownership + status check
                const chat = await Chat.findOne(chatOwnerQuery(chatId, sessionId));
                if (!chat) {
                    emitError(socket, 'CHAT_NOT_FOUND', 'Chat not found or access denied.');
                    ack?.({ ok: false, error: 'CHAT_NOT_FOUND' });
                    return;
                }
                if (chat.status !== 'open') {
                    emitError(socket, 'CHAT_CLOSED', 'This chat is closed.');
                    ack?.({ ok: false, error: 'CHAT_CLOSED' });
                    return;
                }

                // Persist user message
                const userMessage = await Message.create({
                    chatId,
                    sessionId,
                    role:        'user',
                    contentType,
                    content:     content.trim(),
                    status:      'sent',
                });

                // Broadcast to other tabs but NOT the sender (who relies on the ack/optimistic UI)
                // We pass back the clientId so clients can firmly deduplicate if they happen to receive it.
                const messageData = userMessage.toObject();
                socket.to(chatId).emit('chat:message:new', { ...messageData, clientId });
                Session.findOneAndUpdate({ sessionId }, { $inc: { messageCount: 1 } }).exec();
                ack?.({ ok: true, messageId: userMessage._id });

                // ── AI response (ai_assistant chats) ───────────────────────
                if (chat.type !== 'ai_assistant') return;

                // Idempotency lock — prevents duplicate AI calls
                const lock = await redis.set(AI_LOCK_KEY(chatId), '1', 'EX', 60, 'NX');
                if (!lock) return;

                const aiModel = chat.aiModel ?? 'llama3-8b-8192';

                // Emit thinking indicator — client shows animated dots
                io.to(chatId).emit('chat:ai:thinking', { chatId, isThinking: true });

                try {
                    const fullResponse = await generateAIResponse(content, aiModel);

                    const aiMessage = await Message.create({
                        chatId,
                        sessionId,
                        role:        'assistant',
                        contentType: 'markdown',
                        content:     fullResponse,
                        status:      'delivered',
                        aiMetadata:  { model: aiModel },
                    });

                    // Stop thinking indicator and deliver full response
                    io.to(chatId).emit('chat:ai:thinking', { chatId, isThinking: false });
                    io.to(chatId).emit('chat:ai:done', {
                        chatId,
                        messageId: aiMessage._id,
                        content:   fullResponse,
                    });
                } catch (aiErr) {
                    console.error('[chat:ai]', aiErr);
                    io.to(chatId).emit('chat:ai:thinking', { chatId, isThinking: false });
                    io.to(chatId).emit('chat:ai:error', { chatId });
                } finally {
                    await redis.del(AI_LOCK_KEY(chatId));
                }
            } catch (err) {
                logger.error({ err, chatId, sessionId }, '[chat:message] failed');
                emitError(socket, 'MESSAGE_FAILED', 'Could not send message.');
                ack?.({ ok: false, error: 'MESSAGE_FAILED' });
            }
        },
    );

    // ── chat:typing ────────────────────────────────────────────────────────
    socket.on('chat:typing', (payload: { chatId: string; isTyping: boolean }) => {
        socket.to(payload.chatId).emit('chat:typing', {
            chatId:    payload.chatId,
            sessionId,
            isTyping:  payload.isTyping,
        });
    });

    // ── disconnect ─────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
        Session.findOneAndUpdate({ sessionId }, { lastSeenAt: new Date() }).exec().catch(() => null);
        logger.info({ sid: socket.id, sessionId, reason }, '[socket] disconnected');
    });

    logger.info({ sid: socket.id, sessionId }, '[socket] connected');
};
