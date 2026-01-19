import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { EVENT_CONFIG, ROUNDS_DATA } from "@/lib/constants";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | TechNegotia",
    description: "Learn about TechNegotia - a multi-round hackathon event focusing on problem-solving, prototyping, and strategic negotiation.",
};

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <h1 className={styles.pageTitle}>About TechNegotia</h1>
                        <p className={styles.pageSubtitle}>
                            Where innovation meets negotiation
                        </p>
                    </div>
                </section>

                {/* Overview Section */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.twoColumn}>
                            <div className={styles.textContent}>
                                <p className={styles.paragraph}>
                                    TechNegotia 3.0 is not your typical hackathon. It is a multi-round,
                                    high-stakes event that combines technical problem-solving with the art
                                    of strategic negotiation and pitching.
                                </p>
                                <p className={styles.paragraph}>
                                    Over the course of one intense day, {EVENT_CONFIG.stats.totalTeams}+ teams
                                    will compete through three distinct rounds, each testing different skills
                                    and eliminating those who cannot adapt.
                                </p>
                                <p className={styles.paragraph}>
                                    From building prototypes under crisis conditions to pitching investors
                                    for virtual credits, and finally defending your valuation in a high-pressure
                                    boardroom - TechNegotia pushes you to think on your feet.
                                </p>
                            </div>
                            <div className={styles.statsBox}>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>{EVENT_CONFIG.stats.totalTeams}+</span>
                                    <span className={styles.statLabel}>Teams</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>3</span>
                                    <span className={styles.statLabel}>Rounds</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>{EVENT_CONFIG.stats.prizePool}</span>
                                    <span className={styles.statLabel}>Prizes</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>1</span>
                                    <span className={styles.statLabel}>Epic Day</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Objectives Section */}
                <section className={styles.sectionDark}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>What We Test</h2>
                        <div className={styles.objectivesGrid}>
                            <div className={styles.objectiveCard}>
                                <div className={styles.objectiveIcon}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                        <polyline points="2 17 12 22 22 17" />
                                        <polyline points="2 12 12 17 22 12" />
                                    </svg>
                                </div>
                                <h3>Problem Solving</h3>
                                <p>Analyze complex problems and develop innovative, practical solutions under time pressure.</p>
                            </div>
                            <div className={styles.objectiveCard}>
                                <div className={styles.objectiveIcon}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                    </svg>
                                </div>
                                <h3>Rapid Prototyping</h3>
                                <p>Transform ideas into tangible prototypes - wireframes, mockups, or demos that communicate your vision.</p>
                            </div>
                            <div className={styles.objectiveCard}>
                                <div className={styles.objectiveIcon}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                        <line x1="12" y1="9" x2="12" y2="13" />
                                        <line x1="12" y1="17" x2="12.01" y2="17" />
                                    </svg>
                                </div>
                                <h3>Crisis Management</h3>
                                <p>Adapt when unexpected challenges arise. Pivot your solution without losing momentum.</p>
                            </div>
                            <div className={styles.objectiveCard}>
                                <div className={styles.objectiveIcon}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                </div>
                                <h3>Pitching</h3>
                                <p>Convince investors in 90 seconds. Secure the credits you need to advance to the finals.</p>
                            </div>
                            <div className={styles.objectiveCard}>
                                <div className={styles.objectiveIcon}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <h3>Negotiation</h3>
                                <p>Defend your valuation, counter objections, and close the deal in high-stakes boardroom scenarios.</p>
                            </div>
                            <div className={styles.objectiveCard}>
                                <div className={styles.objectiveIcon}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                                <h3>Time Management</h3>
                                <p>Every round has strict deadlines. Prioritize, delegate, and deliver on time.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Round Overview */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>The Journey</h2>
                        <div className={styles.roundsOverview}>
                            {ROUNDS_DATA.map((round, index) => (
                                <div key={round.id} className={styles.roundOverviewCard}>
                                    <div
                                        className={styles.roundNumber}
                                        style={{ background: round.color }}
                                    >
                                        {round.id}
                                    </div>
                                    <div className={styles.roundInfo}>
                                        <h3>{round.title}: {round.subtitle}</h3>
                                        <p>{round.description}</p>
                                        <div className={styles.roundMeta}>
                                            <span>{round.teams}</span>
                                            <span>{round.duration}</span>
                                        </div>
                                    </div>
                                    {index < ROUNDS_DATA.length - 1 && (
                                        <div className={styles.roundArrow}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <polyline points="19 12 12 19 5 12" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Venue Section */}
                <section className={styles.sectionDark}>
                    <div className={styles.container}>
                        <div className={styles.venueGrid}>
                            <div className={styles.venueInfo}>
                                <h2 className={styles.sectionTitle}>Venue & Date</h2>
                                <div className={styles.venueDetails}>
                                    <div className={styles.venueItem}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        <div>
                                            <h4>Location</h4>
                                            <p>{EVENT_CONFIG.venue.name}</p>
                                        </div>
                                    </div>
                                    <div className={styles.venueItem}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        <div>
                                            <h4>Date</h4>
                                            <p>{EVENT_CONFIG.eventDate.toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</p>
                                        </div>
                                    </div>
                                    <div className={styles.venueItem}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <div>
                                            <h4>Duration</h4>
                                            <p>Full Day Event (9 AM onwards)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.venueMap}>
                                <div className={styles.mapPlaceholder}>
                                    <p>Map Coming Soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
