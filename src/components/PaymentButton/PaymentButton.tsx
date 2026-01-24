"use client";

import styles from "./PaymentButton.module.css";

interface PaymentButtonProps {
    paymentLink?: string;
    isAuthenticated?: boolean;
}

export default function PaymentButton({ paymentLink = "#", isAuthenticated = false }: PaymentButtonProps) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!isAuthenticated) {
            e.preventDefault();
            return;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.buttonWrapper}>
                <a
                    href={isAuthenticated ? paymentLink : "#"}
                    target={isAuthenticated ? "_blank" : undefined}
                    rel={isAuthenticated ? "noopener noreferrer" : undefined}
                    className={`nes-btn is-warning ${styles.paymentButton} ${!isAuthenticated ? styles.locked : ''}`}
                    onClick={handleClick}
                    aria-disabled={!isAuthenticated}
                >
                    <span className={styles.buttonIcon}>{isAuthenticated ? '💰' : '🔒'}</span>
                    Pay Registration Fee
                    <span className={styles.buttonIcon}>{isAuthenticated ? '💰' : '🔒'}</span>
                </a>

                {/* CSS-only tooltip */}
                <div className={styles.tooltip}>
                    <div className={`nes-container with-title ${styles.tooltipContainer}`}>
                        <p className="title">
                            {isAuthenticated ? '⚠️ Important Quest Item ⚠️' : '🔒 Sign In Required 🔒'}
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
