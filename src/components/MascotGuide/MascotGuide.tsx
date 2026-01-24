'use client';

import { useEffect } from 'react';
import styles from './MascotGuide.module.css';
import NextImage from 'next/image';
import { MascotMessage } from '@/lib/mascotData';
import { MASCOTS } from '@/lib/mascotData';

interface MascotGuideProps {
    message: MascotMessage;
    isVisible: boolean;
    onDismiss: () => void;
    onNext?: () => void;
    hasMore?: boolean;
}

export default function MascotGuide({
    message,
    isVisible,
    onDismiss,
    onNext,
    hasMore = false
}: MascotGuideProps) {
    // Use consistent mascot (first one) with safety check
    const mascot = MASCOTS.length > 0 ? MASCOTS[0] : null;

    // Keyboard shortcuts - MUST run before any early returns
    useEffect(() => {
        // Only attach listeners when visible
        if (!isVisible) return;

        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && message.dismissible) {
                onDismiss();
            } else if (e.key === 'Enter' && hasMore && onNext) {
                onNext();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isVisible, message.dismissible, hasMore, onDismiss, onNext]);

    // Early return AFTER hooks
    if (!mascot || !isVisible) {
        return null;
    }

    // Get message type styling
    const getMessageTypeClass = () => {
        switch (message.type) {
            case 'greeting': return styles.typeGreeting;
            case 'help': return styles.typeHelp;
            case 'tip': return styles.typeTip;
            case 'celebration': return styles.typeCelebration;
            case 'warning': return styles.typeWarning;
            case 'info': return styles.typeInfo;
            default: return '';
        }
    };

    return (
        <div className={`${styles.mascotContainer} ${isVisible ? styles.visible : ''}`}>
            {/* Mascot Character */}
            <div className={styles.mascotSprite}>
                <NextImage
                    src={mascot.src}
                    alt="Guide Mascot"
                    width={180}
                    height={180}
                    className={styles.mascotImage}
                    unoptimized
                />
            </div>

            {/* Dialogue Box */}
            <div className={`${styles.dialogueBox} ${getMessageTypeClass()}`}>
                {/* Close button */}
                {message.dismissible && (
                    <button
                        className={styles.closeButton}
                        onClick={onDismiss}
                        aria-label="Dismiss message"
                    >
                        ✕
                    </button>
                )}

                {/* Message Type Icon */}
                <div className={styles.messageIcon}>
                    {message.type === 'greeting' && '👋'}
                    {message.type === 'help' && '❓'}
                    {message.type === 'tip' && '💡'}
                    {message.type === 'celebration' && '🎉'}
                    {message.type === 'warning' && '⚠️'}
                    {message.type === 'info' && 'ℹ️'}
                </div>

                {/* Message Text with Typewriter Effect */}
                <div className={styles.messageText}>
                    <p className={styles.typewriter}>{message.text}</p>
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    {hasMore && onNext && (
                        <button
                            className={`${styles.actionButton} ${styles.nextButton}`}
                            onClick={onNext}
                        >
                            Next →
                        </button>
                    )}
                    {message.dismissible && (
                        <button
                            className={`${styles.actionButton} ${styles.dismissButton}`}
                            onClick={onDismiss}
                        >
                            {hasMore ? 'Skip' : 'Got it!'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
