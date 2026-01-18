"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./ProgressionCarousel.module.css";

const PROGRESSION_STEPS = [
    {
        id: 1,
        label: "Phase 1: Registration",
        title: "Join the Adventure",
        description: "Register your team and get ready. The journey begins with choosing your problem statement.",
        image: "/html-parralax-combined.gif"
    },
    {
        id: 2,
        label: "Phase 2: The Challenge",
        title: "Build & Adapt",
        description: "Develop your prototype. Sudden crisis scenarios will test your team's resilience and adaptability.",
        image: "/fire-animation.gif"
    },
    {
        id: 3,
        label: "Phase 3: Victory",
        title: "Pitch & Conquer",
        description: "Secure investment credits and defend your valuation in the boardroom. Only the best survive.",
        image: "/javascript-course-banner.gif"
    }
];

export default function ProgressionCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? PROGRESSION_STEPS.length - 1 : prev - 1));
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % PROGRESSION_STEPS.length);
    }, []);

    // Pause auto-slide on hover/interaction could be handled here, 
    // but for now we just ensuring basic interval works.
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [nextSlide]); // Re-creates timer when nextSlide changes (or dependencies change)

    return (
        <div className={styles.carousel}>
            <button
                className={`${styles.navButton} ${styles.navPrev}`}
                onClick={prevSlide}
                aria-label="Previous Slide"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            <button
                className={`${styles.navButton} ${styles.navNext}`}
                onClick={nextSlide}
                aria-label="Next Slide"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>

            <div className={styles.viewport}>
                <div
                    className={styles.container}
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {PROGRESSION_STEPS.map((step) => (
                        <div key={step.id} className={styles.slide}>
                            <div className={styles.card}>
                                <div className={styles.imageContainer}>
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className={styles.image}
                                        unoptimized // Required for GIFs to animate correctly in some Next.js configs
                                    />
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.stepLabel}>{step.label}</div>
                                    <h3 className={styles.title}>{step.title}</h3>
                                    <p className={styles.description}>{step.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.dots}>
                {PROGRESSION_STEPS.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ""}`}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
