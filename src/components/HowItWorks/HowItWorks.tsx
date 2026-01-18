"use client";

import { useState, useEffect } from "react";
import styles from "./HowItWorks.module.css";
import { ROUNDS_DATA } from "@/lib/constants";
import NextImage from "next/image";

export default function HowItWorks() {
    const [activeRound, setActiveRound] = useState<typeof ROUNDS_DATA[0] | null>(null);
    const [typedText, setTypedText] = useState("");

    useEffect(() => {
        if (!activeRound) {
            setTypedText("");
            return;
        }

        const fullText = activeRound.modalText || "";
        let typingInterval: NodeJS.Timeout;
        const startTimeout = setTimeout(() => {
            let i = 0;
            typingInterval = setInterval(() => {
                setTypedText(fullText.slice(0, i + 1));
                i++;
                if (i === fullText.length) clearInterval(typingInterval);
            }, 50);
        }, 3000);

        return () => {
            clearTimeout(startTimeout);
            if (typingInterval) clearInterval(typingInterval);
        };
    }, [activeRound]);

    return (
        <section className={styles.section} id="how-it-works">
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>How It Works</h2>
                    <p className={styles.sectionDesc}>
                        Three intense rounds testing your problem-solving, pitching, and negotiation skills
                    </p>
                </div>

                <div className={styles.roundsDisplay}>
                    {ROUNDS_DATA.map((round) => (
                        <div key={round.id} className={styles.roundCard}>
                            <div className={styles.roundHeader} style={{ borderColor: round.color }}>
                                <h3 className={styles.roundTitle} style={{ color: round.color }}>{round.title}</h3>
                                <span className={styles.roundSubtitle}>{round.subtitle}</span>
                            </div>
                            <div className={styles.roundBody}>
                                <p className={styles.roundDescription}>{round.description}</p>

                                <div className={styles.roundStats}>
                                    <div className={styles.statTag}>
                                        <span>{round.teams}</span>
                                    </div>
                                    <div className={styles.statTag}>
                                        <span>{round.duration}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                className={styles.learnMoreBtn}
                                onClick={() => setActiveRound(round)}
                            >
                                Learn More
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {/* Modal */}
            {activeRound && (
                <div className={styles.modalOverlay} onClick={() => setActiveRound(null)}>
                    <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>

                        {/* Visual Side (Floating Outside) */}
                        <div className={styles.visualWrapper}>
                            <div className={styles.helperText}>
                                {typedText}
                            </div>
                            <div className={styles.visualContainer}>
                                <NextImage
                                    src={activeRound.gif || "/output-onlinegiftools.gif"}
                                    alt="Round Animation"
                                    fill
                                    className={styles.modalGif}
                                    unoptimized
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                        </div>

                        {/* Info Card */}
                        <div
                            className={styles.infoCard}
                            style={{ borderColor: activeRound.color, boxShadow: `0 0 30px ${activeRound.color}40` }}
                        >
                            <button
                                className={styles.closeButton}
                                onClick={() => setActiveRound(null)}
                            >
                                X
                            </button>

                            <div className={styles.modalHeader}>
                                <h3 className={styles.modalTitle}>{activeRound.title}</h3>
                                <span className={styles.modalSubtitle}>{activeRound.subtitle}</span>
                            </div>

                            <ul className={styles.detailsList}>
                                {activeRound.details?.map((detail, index) => (
                                    <li key={index}>{detail}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
