'use client';

import type { ChatMessage } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
    message: ChatMessage;
}

// Animated thinking dots
function ThinkingDots() {
    return (
        <span className="inline-flex items-center gap-1 py-1">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-current opacity-60"
                    style={{
                        animation: `chat-thinking-bounce 1.2s infinite`,
                        animationDelay: `${i * 0.2}s`,
                    }}
                />
            ))}
        </span>
    );
}

export default function ChatMessageBubble({ message }: ChatMessageProps) {
    const isUser    = message.role === 'user';
    const isThinking = message.isThinking;

    return (
        <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
            {/* Avatar for assistant */}
            {!isUser && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center mr-2 mt-0.5 text-primary-foreground text-xs font-bold select-none">
                    AI
                </div>
            )}

            <div
                className={cn(
                    'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words',
                    isUser
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted text-foreground rounded-tl-sm',
                    message.status === 'failed' && 'opacity-50 border border-destructive',
                )}
            >
                {isThinking ? (
                    <ThinkingDots />
                ) : (
                    <>
                        {message.content}
                        {message.status === 'failed' && (
                            <span className="block text-[10px] text-destructive mt-1">Failed to send</span>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
