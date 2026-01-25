"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/Toast";
import styles from "./Hero.module.css";

/** Razorpay payment portal link */
const PAYMENT_LINK = "https://pages.razorpay.com/pl_S6rLrbGpmxkKPx/view";

export default function Hero() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { showWarning, showInfo, showSuccess } = useToast();
    const heroRef = useRef<HTMLDivElement>(null);
    const [displayText, setDisplayText] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const fullText = "Begin Your Quest";

    /**
     * Handles click on locked quest button - shows toast notification
     */
    const handleLockedClick = () => {
        showWarning("Please sign in to begin your quest!");
    };

    /**
     * Handles click on the main CTA button when authenticated
     * Opens payment portal
     */
    const handleBeginQuest = () => {
        showInfo("Opening payment portal...");
        window.open(PAYMENT_LINK, "_blank", "noopener,noreferrer");
    };

    // Parallax scroll effect for background video
    useEffect(() => {
        const handleScroll = () => {
            if (!heroRef.current) return;

            const scrollY = window.scrollY;
            const video = heroRef.current.querySelector(`.${styles.backgroundVideo}`) as HTMLElement;

            // Parallax effect - video moves slower than scroll
            if (video) {
                video.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`;
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Typewriter effect
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const startTyping = () => {
            let currentIndex = 0;

            const typeNextChar = () => {
                if (currentIndex < fullText.length) {
                    setDisplayText(fullText.slice(0, currentIndex + 1));
                    currentIndex++;
                    timeoutId = setTimeout(typeNextChar, 200); // 200ms per character
                } else {
                    // Stop cursor blinking after typing is complete
                    setTimeout(() => setShowCursor(false), 1000);
                }
            };

            typeNextChar();
        };

        // Start typing after 1 second delay
        timeoutId = setTimeout(startTyping, 1000);

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [fullText]);

    return (
        <section className={styles.hero} ref={heroRef}>
            {/* Animated Background Video with Parallax */}
            <div className={styles.animatedBackground}>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className={styles.backgroundVideo}
                >
                    <source src="/video (2).mp4" type="video/mp4" />
                </video>
            </div>

            {/* Gradient Overlay - subtle bottom fade */}
            <div className={styles.overlay} />

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.contentInner}>
                    <p className={styles.preTitle}>Venture forth into the realm of</p>

                    <h1 className={styles.title}>
                        <span className={styles.titleScript}>TechNegotia</span>
                    </h1>

                    <p className={styles.tagline}>
                        Fortune favors the strategic.
                    </p>

                </div>
            </div>

            {/* Floating Action Card - Bottom Right */}
            <div className={styles.actionCard}>
                <div className={styles.actionCardHeader}>
                    <i className="hn hn-sparkles"></i>
                    <span>Join the Quest</span>
                </div>
                
                <div className={styles.actionButtons}>
                    {/* Pay Registration Fee Button */}
                    {authLoading ? (
                        <button className={`${styles.payButton} ${styles.payButtonLoading}`} disabled>
                            <i className="hn hn-loading"></i>
                            Loading...
                        </button>
                    ) : user ? (
                        <button
                            className={styles.payButton}
                            onClick={handleBeginQuest}
                        >
                            <i className="hn hn-coin"></i>
                            Pay Registration Fee
                        </button>
                    ) : (
                        <button
                            className={`${styles.payButton} ${styles.payButtonLocked}`}
                            onClick={handleLockedClick}
                        >
                            <i className="hn hn-lock"></i>
                            Pay Registration Fee
                        </button>
                    )}

                    {/* Register Button */}
                    {authLoading ? (
                        <button className={`${styles.registerButton} ${styles.registerButtonLoading}`} disabled>
                            <i className="hn hn-loading"></i>
                            Loading...
                        </button>
                    ) : user ? (
                        <Link href="/register" className={styles.registerButton}>
                            <i className="hn hn-sword"></i>
                            Register Team
                        </Link>
                    ) : (
                        <button
                            className={`${styles.registerButton} ${styles.registerButtonLocked}`}
                            onClick={handleLockedClick}
                        >
                            <i className="hn hn-lock"></i>
                            Register Team
                        </button>
                    )}
                </div>

                <p className={styles.actionHint}>
                    {user ? "Pay first, then register" : "Sign in to continue"}
                </p>
            </div>

            {/* Supported By Section - at bottom like reference */}
            <div className={styles.supporters}>
                <span className={styles.supportersLabel}>ORGANIZED BY</span>
                <div className={styles.supportersLogos}>
                    <Image
                        src="/ChatGPT_Image_Jan_18__2026__03_32_18_AM-removebg-preview.png"
                        alt="Sponsors"
                        width={300}
                        height={80}
                        className={styles.sponsorImage}
                    />
                </div>
            </div>
        </section>
    );
}
