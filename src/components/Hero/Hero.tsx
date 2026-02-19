"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Hero.module.css";

/** Video sources */
const DESKTOP_VIDEO = "/video (2).mp4";
const MOBILE_VIDEO = "/video (3).mp4";

/** Mobile breakpoint in pixels */
const MOBILE_BREAKPOINT = 768;

/** Quest release time — Feb 20, 2026 12:00 PM IST (UTC+5:30 = 06:30 UTC) */
const QUEST_RELEASE_TIME = new Date('2026-02-20T06:30:00Z').getTime();

type HeroProps = {
    /** Called when user taps "Sign In / Sign Up" in the hero (opens auth modal on home) */
    onSignInClick?: () => void;
};


export default function Hero({ onSignInClick }: HeroProps = {}) {
    const heroRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Countdown timer state
    const [timeLeft, setTimeLeft] = useState(() => {
        const diff = QUEST_RELEASE_TIME - Date.now();
        return diff > 0 ? diff : 0;
    });
    const questsUnlocked = timeLeft <= 0;

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

    // Countdown ticker — updates every second
    useEffect(() => {
        if (questsUnlocked) return;

        const interval = setInterval(() => {
            const diff = QUEST_RELEASE_TIME - Date.now();
            if (diff <= 0) {
                setTimeLeft(0);
                clearInterval(interval);
            } else {
                setTimeLeft(diff);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [questsUnlocked]);

    // Format the countdown into hours/minutes/seconds
    const formatCountdown = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return { hours, minutes, seconds };
    };

    const countdown = formatCountdown(timeLeft);

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

            {/* Quest Portal Button */}
            <div className={styles.actionCard}>
                <div className={styles.actionCardHeader}>
                    <i className="hn hn-sparkles"></i>
                    <span>Join the Quest</span>
                </div>
                <div className={styles.actionButtons}>
                    <div className={styles.questBtnWrapper}>
                        {/* Outer magical aura */}
                        <div className={`${styles.questAura} ${!questsUnlocked ? styles.questAuraLocked : ''}`} />
                        {/* Floating sparkle particles */}
                        <div className={styles.questSparkles}>
                            {[...Array(8)].map((_, i) => (
                                <span key={i} className={styles.sparkle} style={{
                                    '--i': i,
                                    '--total': 8,
                                } as React.CSSProperties} />
                            ))}
                        </div>

                        {questsUnlocked ? (
                            <Link href="/quests" className={styles.questPortalBtn}>
                                <span className={styles.questPortalBtnGlow} />
                                <span className={styles.questPortalBtnShimmer} />
                                <span className={styles.questPortalBtnIcon}>⚔️</span>
                                <span className={styles.questPortalBtnText}>Quests Are Available</span>
                                <span className={styles.questPortalBtnArrow}>→</span>
                            </Link>
                        ) : (
                            <div className={styles.questPortalBtnLocked}>
                                <span className={styles.questPortalBtnIcon}>🔒</span>
                                <span className={styles.questPortalBtnText}>Quests Unlock In</span>
                                <div className={styles.questTimerInline}>
                                    <span className={styles.timerDigit}>{String(countdown.hours).padStart(2, '0')}</span>
                                    <span className={styles.timerSep}>:</span>
                                    <span className={styles.timerDigit}>{String(countdown.minutes).padStart(2, '0')}</span>
                                    <span className={styles.timerSep}>:</span>
                                    <span className={styles.timerDigit}>{String(countdown.seconds).padStart(2, '0')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
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
