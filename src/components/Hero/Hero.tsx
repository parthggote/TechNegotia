"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import PaymentButton from "@/components/PaymentButton/PaymentButton";
import styles from "./Hero.module.css";

export default function Hero() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const heroRef = useRef<HTMLDivElement>(null);
    const [displayText, setDisplayText] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const fullText = "Start the Quest";

    useEffect(() => {
        const handleScroll = () => {
            if (!heroRef.current) return;

            const scrollY = window.scrollY;
            const sky = heroRef.current.querySelector(`.${styles.layerSky}`) as HTMLElement;
            const mountains = heroRef.current.querySelector(`.${styles.layerMountains}`) as HTMLElement;
            const hills = heroRef.current.querySelector(`.${styles.layerHills}`) as HTMLElement;
            const grass = heroRef.current.querySelector(`.${styles.layerGrass}`) as HTMLElement;

            // Adjusted parallax speeds
            if (sky) sky.style.transform = `translateY(${scrollY * 0.1}px)`;
            if (mountains) mountains.style.transform = `translateY(${scrollY * 0.15}px)`;
            if (hills) hills.style.transform = `translateY(${scrollY * 0.25}px)`;
            if (grass) grass.style.transform = `translateY(${scrollY * 0.4}px)`;
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
            {/* Parallax Layers */}
            <div className={styles.parallaxContainer}>
                {/* Layer 1: Sky - Background */}
                <div className={`${styles.layer} ${styles.layerSky}`}></div>

                {/* Layer 2: Mountains */}
                <div className={`${styles.layer} ${styles.layerMountains}`}></div>

                {/* Layer 3: Hills */}
                <div className={`${styles.layer} ${styles.layerHills}`}></div>

                {/* Layer 4: Grass */}
                <div className={`${styles.layer} ${styles.layerGrass}`}></div>
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

                    <div className={styles.cta}>
                        {/* Start the Quest Button - Conditional based on auth */}
                        {authLoading ? (
                            <button className={`nes-btn is-warning ${styles.typewriterBtn}`} disabled>
                                <span className={styles.typewriterText}>Loading...</span>
                            </button>
                        ) : user ? (
                            <Link href="/register" className={`nes-btn is-warning ${styles.typewriterBtn}`}>
                                <span className={styles.typewriterText}>
                                    {displayText}
                                    {showCursor && <span className={styles.cursor}>|</span>}
                                </span>
                            </Link>
                        ) : (
                            <div className={styles.lockedButtonWrapper}>
                                <button
                                    className={`nes-btn is-warning ${styles.typewriterBtn} ${styles.questButtonDisabled}`}
                                    disabled
                                    title="Please sign in to start the quest"
                                >
                                    <span className={styles.typewriterText}>
                                        🔒 {displayText}
                                    </span>
                                </button>
                                <div className={styles.lockedTooltip}>
                                    Please sign in to start the quest
                                </div>
                            </div>
                        )}

                        {/* Payment Button */}
                        <div className={styles.paymentButtonWrapper}>
                            <PaymentButton paymentLink="#" isAuthenticated={!!user && !authLoading} />
                        </div>
                    </div>
                </div>

                {/* Mascot - positioned like reference */}
                <div className={styles.mascot}>
                    <Image
                        src="/LandingPage_Mascot.webp"
                        alt="TechNegotia Mascot"
                        width={180}
                        height={180}
                        priority
                    />
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
