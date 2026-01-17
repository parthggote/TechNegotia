import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Timeline from "@/components/Timeline/Timeline";
import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";
import { SCHEDULE_DATA, EVENT_CONFIG } from "@/lib/constants";
import styles from "./page.module.css";

export const metadata = {
    title: "Schedule | TechNegotia 3.0",
    description: "View the complete schedule for TechNegotia 3.0 - from problem release to final winners announcement.",
};

export default function SchedulePage() {
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

                {/* Key Dates */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.keyDatesGrid}>
                            <div className={styles.keyDateCard}>
                                <div className={styles.keyDateIcon}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="12" y1="18" x2="12" y2="12" />
                                        <line x1="9" y1="15" x2="15" y2="15" />
                                    </svg>
                                </div>
                                <h3>Problem Release</h3>
                                <p className={styles.keyDateValue}>
                                    {EVENT_CONFIG.problemReleaseDate.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                                <p className={styles.keyDateTime}>6:00 PM via Social Media</p>
                            </div>

                            <div className={styles.keyDateCard}>
                                <div className={styles.keyDateIcon}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </div>
                                <h3>Event Day</h3>
                                <p className={styles.keyDateValue}>
                                    {EVENT_CONFIG.eventDate.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                                <p className={styles.keyDateTime}>9:00 AM - 7:00 PM</p>
                            </div>

                            <div className={styles.keyDateCard}>
                                <div className={styles.keyDateIcon}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="8" r="7" />
                                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                                    </svg>
                                </div>
                                <h3>Winners Announced</h3>
                                <p className={styles.keyDateValue}>
                                    {EVENT_CONFIG.eventDate.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                                <p className={styles.keyDateTime}>7:00 PM</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Timeline Section */}
                <section className={styles.sectionDark}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Day of Event</h2>
                        <Timeline events={SCHEDULE_DATA} />
                    </div>
                </section>

                {/* Team Flow */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Team Progression</h2>
                        <div className={styles.flowChart}>
                            <div className={styles.flowNode}>
                                <div className={styles.flowNumber}>{EVENT_CONFIG.stats.totalTeams}+</div>
                                <div className={styles.flowLabel}>Teams Register</div>
                            </div>
                            <div className={styles.flowArrow}>
                                <svg width="48" height="24" viewBox="0 0 48 24">
                                    <path d="M0 12 L40 12 M32 4 L40 12 L32 20" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </div>
                            <div className={styles.flowNode}>
                                <div className={styles.flowNumber}>{EVENT_CONFIG.stats.round2Teams}</div>
                                <div className={styles.flowLabel}>Advance to Round 2</div>
                            </div>
                            <div className={styles.flowArrow}>
                                <svg width="48" height="24" viewBox="0 0 48 24">
                                    <path d="M0 12 L40 12 M32 4 L40 12 L32 20" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </div>
                            <div className={styles.flowNode}>
                                <div className={styles.flowNumber}>{EVENT_CONFIG.stats.round3Teams}</div>
                                <div className={styles.flowLabel}>Final Boardroom</div>
                            </div>
                            <div className={styles.flowArrow}>
                                <svg width="48" height="24" viewBox="0 0 48 24">
                                    <path d="M0 12 L40 12 M32 4 L40 12 L32 20" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </div>
                            <div className={`${styles.flowNode} ${styles.flowNodeWinner}`}>
                                <div className={styles.flowNumber}>3</div>
                                <div className={styles.flowLabel}>Winners</div>
                            </div>
                        </div>
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
        </>
    );
}
