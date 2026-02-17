"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/Toast";
import styles from "./Hero.module.css";

/** Razorpay payment portal link */
const PAYMENT_LINK = "";

/** Video sources */
const DESKTOP_VIDEO = "/video (2).mp4";
const MOBILE_VIDEO = "/video (3).mp4";

/** Mobile breakpoint in pixels */
const MOBILE_BREAKPOINT = 768;

type HeroProps = {
    /** Called when user taps "Sign In / Sign Up" in the hero (opens auth modal on home) */
    onSignInClick?: () => void;
};

export default function Hero({ onSignInClick }: HeroProps = {}) {
    const { user, loading: authLoading } = useAuth();
    const { showInfo, showWarning } = useToast();
    const heroRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    /** Desktop: click on locked Pay/Register shows toast */
    const handleLockedClick = () => {
        showWarning("Please sign in to begin your quest!");
    };

    /**
     * Handles click when registration is closed
     * Shows retro game-themed message
     */
    const handleRegistrationClosed = () => {
        showWarning("Sorry Adventurers, the portal to the quest is closed!!!");
    };

    /**
     * Handles click on the main CTA button when authenticated
     * Opens payment portal
     */
    const handleBeginQuest = () => {
        showInfo("Opening payment portal...");
        window.open(PAYMENT_LINK, "_blank", "noopener,noreferrer");
    };

    // Detect mobile viewport and switch video source
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
            setIsMobile(mobile);
        };

        // Initial check
        checkMobile();

        // Listen for resize events
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Update video source when mobile state changes
    useEffect(() => {
        if (videoRef.current) {
            const newSrc = isMobile ? MOBILE_VIDEO : DESKTOP_VIDEO;
            const currentSrc = videoRef.current.querySelector("source")?.src || "";

            // Only reload if source actually changed
            if (!currentSrc.endsWith(newSrc.replace("/", ""))) {
                videoRef.current.load();
                videoRef.current.play().catch(() => {
                    // Autoplay might be blocked, that's okay
                });
            }
        }
    }, [isMobile]);

    // Parallax scroll effect for background video (desktop only)
    useEffect(() => {
        const handleScroll = () => {
            if (!heroRef.current || isMobile) return;

            const scrollY = window.scrollY;
            const video = heroRef.current.querySelector(`.${styles.backgroundVideo}`) as HTMLElement;

            // Parallax effect - video moves slower than scroll
            if (video) {
                video.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`;
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobile]);

    return (
        <section className={styles.hero} ref={heroRef}>
            {/* Animated Background Video with Parallax */}
            <div className={styles.animatedBackground}>
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className={styles.backgroundVideo}
                    key={isMobile ? "mobile" : "desktop"}
                >
                    <source
                        src={isMobile ? MOBILE_VIDEO : DESKTOP_VIDEO}
                        type="video/mp4"
                    />
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

            {/* Join the Quest card: desktop = always Pay + Register (locked if !user); mobile = Sign In when !user, then Pay + Register */}
            <div className={styles.actionCard}>
                <div className={styles.actionCardHeader}>
                    <i className="hn hn-sparkles"></i>
                    <span>Join the Quest</span>
                </div>

                {authLoading ? (
                    <div className={styles.actionButtons}>
                        <button className={`${styles.payButton} ${styles.payButtonLoading}`} disabled>
                            <i className="hn hn-loading"></i>
                            Loading...
                        </button>
                    </div>
                ) : !isMobile ? (
                    /* Desktop: always show Pay + Register; CLOSED - blurred and disabled */
                    <>
                        <div className={styles.actionButtons}>
                            <button
                                className={`${styles.payButton} ${styles.payButtonLocked}`}
                                onClick={handleRegistrationClosed}
                                style={{ filter: 'blur(1.5px)', cursor: 'not-allowed', opacity: 0.7 }}
                            >
                                <i className="hn hn-lock"></i>
                                Pay Registration Fee
                            </button>
                            {user ? (
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
                            Registration portal closed
                        </p>
                    </>
                ) : !user ? (
                    /* Mobile, not logged in: show only Sign In / Sign Up */
                    <>
                        <div className={styles.actionButtons}>
                            <button
                                type="button"
                                className={styles.heroAuthCta}
                                onClick={onSignInClick ?? (() => {})}
                                aria-label="Sign in or create account"
                            >
                                <i className="hn hn-user"></i>
                                Sign In / Sign Up
                            </button>
                        </div>
                    </>
                ) : (
                    /* Mobile, logged in: show Pay (CLOSED - blurred) and Register */
                    <>
                        <div className={styles.actionButtons}>
                            <button 
                                className={`${styles.payButton} ${styles.payButtonLocked}`}
                                onClick={handleRegistrationClosed}
                                style={{ filter: 'blur(1.5px)', cursor: 'not-allowed', opacity: 0.7 }}
                            >
                                <i className="hn hn-lock"></i>
                                Pay Registration Fee
                            </button>
                            <Link href="/register" className={styles.registerButton}>
                                <i className="hn hn-sword"></i>
                                Register Team
                            </Link>
                        </div>
                        <p className={styles.actionHint}>
                            Registration portal closed
                        </p>
                    </>
                )}
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
