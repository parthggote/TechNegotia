"use client";

import { useToast } from "@/components/Toast";
import styles from "./PaymentButton.module.css";

interface PaymentButtonProps {
    paymentLink?: string;
    isAuthenticated?: boolean;
}

/**
 * Payment button component with authentication check
 * Shows toast notifications for feedback
 */
export default function PaymentButton({ paymentLink = "#", isAuthenticated = false }: PaymentButtonProps) {
    const { showWarning, showInfo, showSuccess } = useToast();

    /**
     * Handles click on payment button
     * Shows appropriate toast based on auth state
     */
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        if (!isAuthenticated) {
            e.preventDefault();
            showWarning("Please sign in to access the payment portal!");
            return;
        }
        // Show info toast when navigating to payment
        showInfo("Opening payment portal...");
    };

    return (
        <div className={styles.container}>
            <div className={styles.buttonWrapper}>
                {isAuthenticated ? (
                    <a
                        href={paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.paymentButton}
                        onClick={handleClick}
                    >
                        <i className={`hn hn-coin ${styles.buttonIcon}`}></i>
                        Pay Registration Fee
                        <i className={`hn hn-coin ${styles.buttonIcon}`}></i>
                    </a>
                ) : (
                    <button
                        className={`${styles.paymentButton} ${styles.locked}`}
                        onClick={handleClick}
                    >
                        <i className={`hn hn-lock ${styles.buttonIcon}`}></i>
                        Pay Registration Fee
                        <i className={`hn hn-lock ${styles.buttonIcon}`}></i>
                    </button>
                )}

                {/* CSS-only tooltip */}
                <div className={styles.tooltip}>
                    <div className={`nes-container with-title ${styles.tooltipContainer}`}>
                        <p className="title">
                            {isAuthenticated ? 'Important Quest Item' : 'Sign In Required'}
                        </p>
                        <p className={styles.tooltipText}>
                            {isAuthenticated
                                ? 'Please pay the registration fee before starting the quest and take a screenshot as it is a main equipment you will need further the quest'
                                : 'Please sign in to access the payment portal and continue your quest'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
