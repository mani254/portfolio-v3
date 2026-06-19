'use client';

import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Send, Trash2, Wifi, WifiOff, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ChatMessageBubble from './ChatMessage';

// Greeting message shown before user types
const GREETING: import('@/hooks/useChat').ChatMessage = {
  _id: '__greeting__',
  role: 'assistant',
  content: '👋 Hi! I\'m here to assist you. Feel free to ask me anything about the portfolio, projects, or just say hello!',
  contentType: 'text',
  status: 'delivered',
  createdAt: new Date().toISOString(),
};

interface ChatPanelProps {
  onClose: () => void;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const { messages, sendMessage, clearChat, isConnected, connectionError, isAiGenerating } = useChat();

  const [input, setInput] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Refocus input after AI finishes generating
  useEffect(() => {
    if (!isAiGenerating && isConnected && textareaRef.current) {
      // Small timeout ensures the input is fully re-enabled before focusing
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  }, [isAiGenerating, isConnected]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || !isConnected || isAiGenerating) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-grow textarea
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  };

  // Combine greeting + real messages
  const allMessages = [GREETING, ...messages];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="
                    w-[400px] max-w-[calc(100vw-2rem)]
                    bg-card border border-border rounded-2xl shadow-2xl
                    flex flex-col overflow-hidden
                "
        style={{ height: 600 }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
          {/* Online indicator */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm select-none">
              AI
            </div>
            <span className={cn(
              'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card',
              isConnected ? 'bg-green-500' : 'bg-muted-foreground',
            )} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight truncate">AI Assistant</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              {isConnected ? (
                <><Wifi className="w-3 h-3 text-green-500" /> Online</>
              ) : (
                <><WifiOff className="w-3 h-3" /> {connectionError ? 'Connection error' : 'Connecting…'}</>
              )}
            </p>
          </div>

          {/* Reset Chat */}
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              title="Reset Chat"
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer ml-2"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
            </button>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted transition-colors cursor-pointer ml-1"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* ── Messages ───────────────────────────────────────── */}
        <div 
            ref={messagesContainerRef}
            data-lenis-prevent="true"
            className="flex-1 overflow-y-auto px-3 py-4 space-y-3 no-scrollbar"
        >
          {allMessages.map((msg) => (
            <ChatMessageBubble key={msg._id} message={msg} />
          ))}
        </div>

        {/* ── Input bar ──────────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-border px-3 py-2.5 bg-card/80 backdrop-blur-sm">
          <div className="flex items-end gap-2 bg-muted rounded-xl px-3 py-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={!isConnected ? 'Connecting…' : isAiGenerating ? 'AI is generating…' : 'Type a message…'}
              disabled={!isConnected || isAiGenerating}
              rows={1}
              className="flex-1 bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground max-h-[120px] leading-relaxed disabled:opacity-50"
              style={{ height: 'auto' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !isConnected || isAiGenerating}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-1.5">
            Press <kbd className="bg-muted border border-border rounded px-1 text-[10px]">Enter</kbd> to send
            · <kbd className="bg-muted border border-border rounded px-1 text-[10px]">Shift+Enter</kbd> for new line
          </p>
        </div>
      </motion.div>
    </>
  );
}
