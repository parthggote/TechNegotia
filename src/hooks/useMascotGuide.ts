'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MascotMessage } from '@/lib/mascotData';

interface UseMascotGuideReturn {
    isVisible: boolean;
    currentMessage: MascotMessage | null;
    showMessage: (message: MascotMessage) => void;
    dismissMessage: () => void;
    nextMessage: () => void;
    messageQueue: MascotMessage[];
    queueMessages: (messages: MascotMessage[]) => void;
}

export function useMascotGuide(pageId: string): UseMascotGuideReturn {
    const [isVisible, setIsVisible] = useState(false);
    const [currentMessage, setCurrentMessage] = useState<MascotMessage | null>(null);
    const [messageQueue, setMessageQueue] = useState<MascotMessage[]>([]);
    const [seenMessages, setSeenMessages] = useState<Set<string>>(new Set());

    // Ref to hold latest dismissMessage to avoid stale closures
    const dismissMessageRef = useRef<() => void>(() => { });
    // Ref to track auto-dismiss timer for cleanup
    const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Load seen messages from localStorage (client-side only)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const stored = localStorage.getItem('mascot-seen-messages');
        if (stored) {
            try {
                setSeenMessages(new Set(JSON.parse(stored)));
            } catch (e) {
                console.error('Failed to parse seen messages:', e);
            }
        }
    }, []);

    // Save seen messages to localStorage
    const markAsSeen = useCallback((messageId: string) => {
        if (typeof window === 'undefined') return;

        setSeenMessages(prev => {
            const updated = new Set(prev);
            updated.add(messageId);
            localStorage.setItem('mascot-seen-messages', JSON.stringify([...updated]));
            return updated;
        });
    }, []);

    // Show a message
    const showMessage = useCallback((message: MascotMessage) => {
        // Check if message should only be shown once
        if (message.showOnce && seenMessages.has(message.id)) {
            return;
        }

        // Clear any existing auto-dismiss timer
        if (autoDismissTimerRef.current) {
            clearTimeout(autoDismissTimerRef.current);
            autoDismissTimerRef.current = null;
        }

        setCurrentMessage(message);
        setIsVisible(true);

        // Mark as seen if showOnce is true
        if (message.showOnce) {
            markAsSeen(message.id);
        }

        // Auto-dismiss if duration is set
        if (message.duration && message.duration > 0) {
            autoDismissTimerRef.current = setTimeout(() => {
                dismissMessageRef.current();
                autoDismissTimerRef.current = null;
            }, message.duration);
        }
    }, [seenMessages, markAsSeen]);

    // Dismiss current message
    const dismissMessage = useCallback(() => {
        // Clear auto-dismiss timer when manually dismissing
        if (autoDismissTimerRef.current) {
            clearTimeout(autoDismissTimerRef.current);
            autoDismissTimerRef.current = null;
        }

        setIsVisible(false);
        setTimeout(() => {
            // Use functional updater to get latest queue state
            setMessageQueue(prev => {
                if (prev.length === 0) {
                    setCurrentMessage(null);
                    return prev;
                }

                const [next, ...rest] = prev;
                showMessage(next);
                return rest;
            });
        }, 300); // Wait for exit animation
    }, [showMessage]);

    // Update ref when dismissMessage changes
    useEffect(() => {
        dismissMessageRef.current = dismissMessage;
    }, [dismissMessage]);

    // Cleanup auto-dismiss timer on unmount
    useEffect(() => {
        return () => {
            if (autoDismissTimerRef.current) {
                clearTimeout(autoDismissTimerRef.current);
            }
        };
    }, []);

    // Show next message in queue
    const nextMessage = useCallback(() => {
        if (messageQueue.length > 0) {
            dismissMessage();
        }
    }, [messageQueue, dismissMessage]);

    // Add messages to queue
    const queueMessages = useCallback((messages: MascotMessage[]) => {
        const filtered = messages.filter(msg =>
            !msg.showOnce || !seenMessages.has(msg.id)
        );

        if (filtered.length > 0) {
            // Show first message immediately
            showMessage(filtered[0]);
            // Queue the rest (not including the first one)
            setMessageQueue(filtered.slice(1));
        }
    }, [seenMessages, showMessage]);

    return {
        isVisible,
        currentMessage,
        showMessage,
        dismissMessage,
        nextMessage,
        messageQueue,
        queueMessages,
    };
}
