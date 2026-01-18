"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);

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
                    <p className={styles.preTitle}>START YOUR</p>

                    <h1 className={styles.title}>
                        <span className={styles.titleMain}>Tech</span>
                        <span className={styles.titleScript}>Negotia</span>
                    </h1>

                    <p className={styles.tagline}>
                        The ultimate hackathon where problem-solving meets negotiation
                    </p>

                    <div className={styles.cta}>
                        <Link href="/register" className="nes-btn is-warning">
                            Get started
                        </Link>
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
                <span className={styles.supportersLabel}>SUPPORTED BY</span>
                <div className={styles.supportersLogos}>
                    <div className={styles.sponsorLogo}>Sponsor 1</div>
                    <div className={styles.sponsorLogo}>Sponsor 2</div>
                    <div className={styles.sponsorLogo}>Sponsor 3</div>
                </div>
            </div>
        </section>
    );
}
