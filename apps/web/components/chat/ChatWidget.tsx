'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import ChatPanel from './ChatPanel';

// ---------------------------------------------------------------------------
// Chat Widget — floating bubble + panel
// ---------------------------------------------------------------------------
// Behaviour:
//   1. Appears after DELAY_MS with a slide-in animation.
//   2. Plays the notification sound once on first appearance.
//   3. Shows an unread badge ("1") until the panel is opened.
//   4. Click → opens ChatPanel; closes button → closes panel.
// ---------------------------------------------------------------------------

const DELAY_MS = 3000; // ms before bubble appears

function playNotification() {
    try {
        const audio = new Audio('/sounds/notification.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {
            // Browser blocked autoplay or file missing — fail silently
        });
    } catch {
        // Ignore
    }
}

export default function ChatWidget() {
    const [visible,  setVisible]  = useState(false); // bubble shown?
    const [open,     setOpen]     = useState(false);  // panel expanded?
    const [hasUnread, setHasUnread] = useState(true);  // show badge?
    const played = useRef(false);

    // Delayed appearance
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
            if (!played.current) {
                played.current = true;
                playNotification();
            }
        }, DELAY_MS);
        return () => clearTimeout(timer);
    }, []);

    const handleOpen = () => {
        setOpen(true);
        setHasUnread(false); // mark as read
    };

    const handleClose = () => setOpen(false);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">

            {/* ── Chat Panel ───────────────────────────────────────── */}
            <AnimatePresence>
                {open && <ChatPanel onClose={handleClose} />}
            </AnimatePresence>

            {/* ── Floating Bubble ──────────────────────────────────── */}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0 }}
                        className="relative"
                    >
                        <button
                            onClick={open ? handleClose : handleOpen}
                            aria-label={open ? 'Close chat' : 'Open chat'}
                            className="
                                w-14 h-14 rounded-full shadow-lg
                                bg-primary text-primary-foreground
                                flex items-center justify-center
                                hover:scale-110 active:scale-95
                                transition-transform duration-200
                                cursor-pointer
                                ring-4 ring-primary/20
                            "
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {open ? (
                                    <motion.span
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="chat"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <MessageCircle className="w-6 h-6" />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        {/* Unread badge */}
                        <AnimatePresence>
                            {hasUnread && !open && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                    className="
                                        absolute -top-1 -right-1
                                        w-5 h-5 rounded-full
                                        bg-destructive text-destructive-foreground
                                        text-[11px] font-bold
                                        flex items-center justify-center
                                        shadow-md
                                        ring-2 ring-card
                                    "
                                >
                                    1
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Pulse ring animation */}
                        {!open && visible && (
                            <span className="absolute inset-0 rounded-full animate-ping bg-primary/30 pointer-events-none" />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
