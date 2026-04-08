'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const SESSION_KEY = 'portfolio_chat_session_id';

import type { MessageRole, ContentType, MessageStatus } from 'database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ChatMessage {
    _id: string;
    role: MessageRole;
    content: string;
    contentType: ContentType;
    status: MessageStatus;
    createdAt: string;
    isThinking?: boolean; // transient — AI is computing
}

interface UseChatReturn {
    messages: ChatMessage[];
    sendMessage: (content: string) => Promise<void>;
    clearChat: () => Promise<void>;
    currentChatId: string | null;
    isConnected: boolean;
    isAiThinking: boolean;
    connectionError: string | null;
}

// ---------------------------------------------------------------------------
// Session ID helpers
// ---------------------------------------------------------------------------
function getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return '';
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
        sid = `anon_${crypto.randomUUID()}`;
        localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
}

// ---------------------------------------------------------------------------
// useChat hook
// ---------------------------------------------------------------------------
export function useChat(): UseChatReturn {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);

    const socketRef = useRef<Socket | null>(null);
    const chatIdRef = useRef<string | null>(null);

    // Keep chatIdRef in sync
    useEffect(() => { chatIdRef.current = currentChatId; }, [currentChatId]);

    // ── Bootstrap socket connection ─────────────────────────────────────
    useEffect(() => {
        const sessionId = getOrCreateSessionId();
        if (!sessionId) return;

        const socket = io(API, {
            auth: { sessionId },
            withCredentials: true,   // sends accessToken cookie if logged in
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
            setConnectionError(null);

            // Auto-initialize the singleton chat
            socket.emit('chat:init', {}, (res: { ok: boolean; chatId?: string }) => {
                if (res.ok && res.chatId) {
                    setCurrentChatId(res.chatId);
                }
            });
        });

        socket.on('disconnect', () => { setIsConnected(false); });
        socket.on('connect_error', (err) => {
            setIsConnected(false);
            setConnectionError(err.message);
        });

        // Initialize history
        socket.on('chat:history', ({ messages }: { chatId: string, messages: ChatMessage[] }) => {
            setMessages(messages);
        });

        // Remote clear chat (multi-tab sync)
        socket.on('chat:cleared', () => {
            setMessages([]);
        });

        // New user message (Broadcasted from other tabs)
        socket.on('chat:message:new', (msg: ChatMessage & { clientId?: string }) => {
            if (msg.role === 'user') {
                setMessages((prev) => {
                    // Deduplicate by DB _id OR the transient clientId used during optimistic UI
                    // Fallback securely: If the backend hasn't hot-reloaded and misses clientId, deduplicate by content match while 'sending'
                    const isDuplicate = prev.some(
                        (m) =>
                            m._id === msg._id ||
                            (msg.clientId && m._id === msg.clientId) ||
                            (m.status === 'sending' && m.content === msg.content)
                    );

                    if (isDuplicate) {
                        return prev;
                    }
                    return [...prev, msg];
                });
            }
        });

        // AI thinking state
        socket.on('chat:ai:thinking', ({ isThinking }: { chatId: string; isThinking: boolean }) => {
            setIsAiThinking(isThinking);
            if (isThinking) {
                // Add transient thinking bubble
                setMessages((prev) => {
                    if (prev.some((m) => m.isThinking)) return prev;
                    return [...prev, {
                        _id: '__thinking__',
                        role: 'assistant',
                        content: '',
                        contentType: 'text',
                        status: 'sending',
                        isThinking: true,
                        createdAt: new Date().toISOString(),
                    }];
                });
            } else {
                // Remove thinking bubble
                setMessages((prev) => prev.filter((m) => !m.isThinking));
            }
        });

        // AI full response
        socket.on('chat:ai:done', ({ content, messageId }: { chatId: string; messageId: string; content: string }) => {
            setIsAiThinking(false);
            setMessages((prev) => [
                ...prev.filter((m) => !m.isThinking),
                {
                    _id: messageId,
                    role: 'assistant',
                    content,
                    contentType: 'markdown',
                    status: 'delivered',
                    createdAt: new Date().toISOString(),
                },
            ]);
        });

        // AI error
        socket.on('chat:ai:error', () => {
            setIsAiThinking(false);
            setMessages((prev) => [
                ...prev.filter((m) => !m.isThinking),
                {
                    _id: `err_${Date.now()}`,
                    role: 'assistant',
                    content: 'Sorry, something went wrong. Please try again.',
                    contentType: 'text',
                    status: 'failed',
                    createdAt: new Date().toISOString(),
                },
            ]);
        });

        return () => { socket.disconnect(); };
    }, []);

    // ── Clear the chat ──────────────────────────────────────────────────
    const clearChat = useCallback(async (): Promise<void> => {
        const socket = socketRef.current;
        const chatId = chatIdRef.current;
        if (!socket?.connected || !chatId) return;

        return new Promise((resolve) => {
            socket.emit('chat:clear', { chatId }, (res: { ok: boolean }) => {
                if (res.ok) {
                    setMessages([]);
                }
                resolve();
            });
        });
    }, []);

    // ── Send a message ──────────────────────────────────────────────────
    const sendMessage = useCallback(async (content: string): Promise<void> => {
        const socket = socketRef.current;
        if (!socket?.connected || !content.trim()) return;

        const chatId = chatIdRef.current;

        if (!chatId) return; // Chat should be initialized already

        // Optimistic user bubble
        const optimisticId = `opt_${Date.now()}`;
        setMessages((prev) => [
            ...prev,
            {
                _id: optimisticId,
                role: 'user',
                content: content.trim(),
                contentType: 'text',
                status: 'sending',
                createdAt: new Date().toISOString(),
            },
        ]);

        socket.emit(
            'chat:message',
            { chatId, content: content.trim(), clientId: optimisticId },
            (res: { ok: boolean; messageId?: string }) => {
                if (res.ok && res.messageId) {
                    // Replace optimistic bubble with server-assigned ID
                    setMessages((prev) =>
                        prev.map((m) => m._id === optimisticId ? { ...m, _id: res.messageId!, status: 'sent' } : m),
                    );
                } else {
                    setMessages((prev) =>
                        prev.map((m) => m._id === optimisticId ? { ...m, status: 'failed' } : m),
                    );
                }
            },
        );
    }, []);

    return {
        messages,
        sendMessage,
        clearChat,
        currentChatId,
        isConnected,
        isAiThinking,
        connectionError,
    };
}
