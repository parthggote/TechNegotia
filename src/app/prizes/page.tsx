'use client';

import { useEffect } from 'react';
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { EVENT_CONFIG } from "@/lib/constants";
import styles from "./page.module.css";
import MascotGuide from "@/components/MascotGuide";
import { useMascotGuide } from "@/hooks/useMascotGuide";
import { MASCOT_MESSAGES } from "@/lib/mascotData";

const PRIZES = [
    {
        position: "1st",
        title: "Grand Champion",
        prize: "₹7,000",
        perks: [
            "Cash Prize",
            "Winner Trophy",
            "Certificates for all members",
            "Exclusive merchandise"
        ],
        color: "#f4a020"
    },
    {
        position: "2nd",
        title: "First Runner-up",
        prize: "₹5,000",
        perks: [
            "Cash Prize",
            "Runner-up Trophy",
            "Certificates for all members",
            "Mentorship sessions",
            "Exclusive merchandise"
        ],
        color: "#C0C0C0"
    },
    {
        position: "3rd",
        title: "Second Runner-up",
        prize: "₹3,000",
        perks: [
            "Cash Prize",
            "Trophy",
            "Certificates for all members",
            "Exclusive merchandise"
        ],
        color: "#CD7F32"
    }
];



export default function PrizesPage() {
    const { isVisible, currentMessage, showMessage, dismissMessage, nextMessage, messageQueue } = useMascotGuide('prizes');

    useEffect(() => {
        const messages = MASCOT_MESSAGES.prizes;
        if (messages && messages.length > 0) {
            setTimeout(() => {
                showMessage(messages[0]);
            }, 1500);
        }
    }, []);

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <h1 className={styles.pageTitle}>Prizes & Rewards</h1>
                        <p className={styles.pageSubtitle}>
                            Compete for glory and amazing prizes worth {EVENT_CONFIG.stats.prizePool}
                        </p>
                    </div>
                </section>

                {/* Main Prizes */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.prizesGrid}>
                            {PRIZES.map((prize, index) => (
                                <div
                                    key={index}
                                    className={`${styles.prizeCard} ${index === 0 ? styles.featured : ""}`}
                                    style={{ "--prize-color": prize.color } as React.CSSProperties}
                                >
                                    <div className={styles.prizePosition}>{prize.position}</div>
                                    <h2 className={styles.prizeTitle}>{prize.title}</h2>
                                    <div className={styles.prizeAmount}>{prize.prize}</div>
                                    <ul className={styles.perksList}>
                                        {prize.perks.map((perk, i) => (
                                            <li key={i}>{perk}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* All Participants */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.participantsCard}>
                            <h2>For All Participants</h2>
                            <div className={styles.participantPerks}>
                                <div className={styles.perkItem}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                    </svg>
                                    <span>Participation Certificate</span>
                                </div>
                                <div className={styles.perkItem}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                    <span>Networking Opportunities</span>
                                </div>
                                <div className={styles.perkItem}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                    <span>Real-world Experience</span>
                                </div>
                                <div className={styles.perkItem}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <line x1="3" y1="9" x2="21" y2="9" />
                                        <line x1="9" y1="21" x2="9" y2="9" />
                                    </svg>
                                    <span>Refreshments & Meals</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main >
            <Footer />

            {/* Mascot Guide */}
            {currentMessage && (
                <MascotGuide
                    message={currentMessage}
                    isVisible={isVisible}
                    onDismiss={dismissMessage}
                    onNext={nextMessage}
                    hasMore={messageQueue.length > 0}
                />
            )}
        </>
    );
}
