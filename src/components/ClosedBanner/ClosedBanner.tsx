"use client";

import { useState, useEffect } from "react";
import styles from "./ClosedBanner.module.css";

export default function ClosedBanner() {
    const fullText = "Registration Closed — The quest portal has been sealed";
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < fullText.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + fullText[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 50); // Speed of typing (50ms per character)

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, fullText]);

    return (
        <div className={styles.bannerContainer}>
            <div className={styles.banner}>
                <div className={styles.content}>
                    <span className={styles.icon}>⚔️</span>
                    <span className={styles.text}>
                        <span className={styles.highlight}>
                            {displayedText.split('—')[0]}
                        </span>
                        {displayedText.includes('—') && (
                            <span className={styles.subtext}>
                                {displayedText.split('—')[1]}
                            </span>
                        )}
                        <span className={styles.cursor}>|</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
