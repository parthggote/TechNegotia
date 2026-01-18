"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./ProgressionCarousel.module.css";

const PROGRESSION_STEPS = [
    {
        id: 1,
        label: "Phase 1: Problem Release",
        title: "The Beginning",
        description: "Review the problem statements released via social media and start strategizing your approach.",
        date: "Friday, Feb 20",
        time: "6:00 PM",
        image: "/html-parralax-combined.gif"
    },
    {
        id: 2,
        label: "Phase 2: Event Day",
        title: "Build & Adapt",
        description: "Build your prototype, handle the crisis scenario, and prepare for the investor pitch.",
        date: "Saturday, Feb 21",
        time: "9:00 AM - 7:00 PM",
        image: "/fire-animation.gif"
    },
    {
        id: 3,
        label: "Phase 3: Finale",
        title: "Winners Announced",
        description: "The final verdict. Winners are announced and prizes are distributed during the closing ceremony.",
        date: "Saturday, Feb 21",
        time: "7:00 PM",
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
        }, 8000); // Change slide every 8 seconds

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

                                    <div className={styles.dateInfo}>
                                        <div className={styles.dateItem}>
                                            <span className={styles.dateLabel}>DATE</span>
                                            <span className={styles.dateValue}>{step.date}</span>
                                        </div>
                                        <div className={styles.dateItem}>
                                            <span className={styles.dateLabel}>TIME</span>
                                            <span className={styles.dateValue}>{step.time}</span>
                                        </div>
                                    </div>

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
