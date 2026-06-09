'use client';

import type { ChatMessage } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const isUser = message.role === 'user';
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
          'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed break-words',
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
            {message.contentType === 'markdown' ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node: _, ...props }) => <a {...props} className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer" />,
                  p: ({ node: _, ...props }) => <p {...props} className="last:mb-0" />,
                  ul: ({ node: _, ...props }) => <ul {...props} className="list-disc pl-4 space-y-1 my-2" />,
                  ol: ({ node: _, ...props }) => <ol {...props} className="list-decimal pl-4 space-y-1 my-2" />,
                  li: ({ node: _, ...props }) => <li {...props} />,
                  strong: ({ node: _, ...props }) => <strong {...props} className="font-bold" />,
                  code({ node: _, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <code
                        {...props}
                        className={cn("block bg-black/10 dark:bg-white/10 rounded p-2.5 overflow-x-auto text-[11px] font-mono whitespace-pre-wrap my-2", className)}
                      >
                        {children}
                      </code>
                    ) : (
                      <code {...props} className="bg-black/10 dark:bg-white/10 rounded px-1.5 py-0.5 text-[11px] font-mono">
                        {children}
                      </code>
                    )
                  },
                  pre: ({ node: _, ...props }) => <pre {...props} className="bg-transparent p-0 m-0" />
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
            {message.status === 'failed' && (
              <span className="block text-[10px] text-destructive mt-1.5">Failed to send</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
