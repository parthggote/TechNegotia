'use client';

import { useEffect } from 'react';
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Timeline from "@/components/Timeline/Timeline";
import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";
import ProgressionCarousel from "@/components/ProgressionCarousel/ProgressionCarousel";
import { SCHEDULE_DATA, EVENT_CONFIG } from "@/lib/constants";
import styles from "./page.module.css";
import MascotGuide from "@/components/MascotGuide";
import { useMascotGuide } from "@/hooks/useMascotGuide";
import { MASCOT_MESSAGES } from "@/lib/mascotData";

export default function SchedulePage() {
    const { isVisible, currentMessage, currentMascot, showMessage, dismissMessage, nextMessage, messageQueue } = useMascotGuide('schedule');

    useEffect(() => {
        const messages = MASCOT_MESSAGES.schedule;
        if (messages && messages.length > 0) {
            const timerId = setTimeout(() => {
                showMessage(messages[0]);
            }, 1500);

            return () => clearTimeout(timerId);
        }
    }, [showMessage]);

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <h1 className={styles.pageTitle}>Event Schedule</h1>
                        <p className={styles.pageSubtitle}>
                            One day. Three rounds. Countless opportunities.
                        </p>
                        <div className={styles.countdownWrapper}>
                            <CountdownTimer
                                targetDate={EVENT_CONFIG.eventDate}
                                label="Event Starts In"
                            />
                        </div>
                    </div>
                </section>





                {/* Team Flow */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Team Progression</h2>

                        <ProgressionCarousel />
                    </div>
                </section>

                {/* Important Notes */}
                <section className={styles.sectionDark}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Important Notes</h2>
                        <div className={styles.notesGrid}>
                            <div className={styles.noteCard}>
                                <h4>Check-in Required</h4>
                                <p>All teams must check in by 9:30 AM. Late arrivals may be disqualified.</p>
                            </div>
                            <div className={styles.noteCard}>
                                <h4>Bring Your Laptop</h4>
                                <p>Each team should have at least one laptop for prototyping and presentations.</p>
                            </div>
                            <div className={styles.noteCard}>
                                <h4>No Pre-submissions</h4>
                                <p>All work must be done on-site during the event. No pre-built solutions allowed.</p>
                            </div>
                            <div className={styles.noteCard}>
                                <h4>Meals Provided</h4>
                                <p>Lunch and refreshments will be provided to all participants.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            {/* Mascot Guide */}
            {currentMessage && (
                <MascotGuide
                    message={currentMessage}
                    isVisible={isVisible}
                    onDismiss={dismissMessage}
                    onNext={nextMessage}
                    hasMore={messageQueue.length > 0}
                    mascot={currentMascot}
                />
            )}
        </>
    );
}
