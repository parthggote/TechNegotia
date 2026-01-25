'use client';

import { useEffect } from 'react';
import styles from './MascotGuide.module.css';
import NextImage from 'next/image';
import { MascotMessage, MascotData, MASCOTS } from '@/lib/mascotData';

interface MascotGuideProps {
    message: MascotMessage;
    isVisible: boolean;
    onDismiss: () => void;
    onNext?: () => void;
    hasMore?: boolean;
    mascot?: MascotData | null;
}

export default function MascotGuide({
    message,
    isVisible,
    onDismiss,
    onNext,
    hasMore = false,
    mascot: propMascot
}: MascotGuideProps) {
    // Use provided mascot or fallback to first one
    const mascot = propMascot ?? (MASCOTS.length > 0 ? MASCOTS[0] : null);

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

    /**
     * Get the appropriate icon class for message type
     */
    const getTypeIcon = () => {
        switch (message.type) {
            case 'greeting': return 'hn hn-heart';
            case 'help': return 'hn hn-question';
            case 'tip': return 'hn hn-lightbulb';
            case 'celebration': return 'hn hn-sparkles';
            case 'warning': return 'hn hn-warning';
            case 'info': return 'hn hn-info';
            default: return 'hn hn-info';
        }
    };

    return (
        <div className={`${styles.mascotContainer} ${isVisible ? styles.visible : ''}`}>
            {/* Mascot Character */}
            <div className={styles.mascotSprite}>
                <NextImage
                    src={mascot.src}
                    alt="Guide Mascot"
                    width={140}
                    height={140}
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
                    <i className={getTypeIcon()}></i>
                </div>

                {/* Message Text */}
                <div className={styles.messageText}>
                    <p>{message.text}</p>
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    {message.dismissible && (
                        <button
                            className={`${styles.actionButton} ${styles.dismissButton}`}
                            onClick={onDismiss}
                        >
                            {hasMore ? 'Skip' : 'Got it!'}
                        </button>
                    )}
                    {hasMore && onNext && (
                        <button
                            className={`${styles.actionButton} ${styles.nextButton}`}
                            onClick={onNext}
                        >
                            Next <i className="hn hn-arrow-right"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
