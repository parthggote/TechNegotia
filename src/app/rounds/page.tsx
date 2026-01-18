import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { ROUNDS_DATA } from "@/lib/constants";
import styles from "./page.module.css";

export const metadata = {
    title: "Rounds | TechNegotia 3.0",
    description: "Explore the three exciting rounds of TechNegotia 3.0 - Prototype & Crisis, Investor Pitch, and Boardroom Negotiation.",
};

export default function RoundsPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <h1 className={styles.pageTitle}>The Three Rounds</h1>
                        <p className={styles.pageSubtitle}>
                            Each round tests different skills. Only the best advance.
                        </p>
                    </div>
                </section>

                {/* Rounds Detail */}
                {ROUNDS_DATA.map((round, index) => (
                    <section
                        key={round.id}
                        className={index % 2 === 0 ? styles.section : styles.sectionDark}
                        id={`round-${round.id}`}
                    >
                        <div className={styles.container}>
                            <div className={styles.roundHeader}>
                                <div
                                    className={styles.roundBadge}
                                    style={{ background: round.color }}
                                >
                                    Round {round.id}
                                </div>
                                <h2 className={styles.roundTitle}>{round.subtitle}</h2>
                                <div className={styles.roundMeta}>
                                    <span className={styles.metaItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                        {round.teams}
                                    </span>
                                    <span className={styles.metaItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        {round.duration}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.roundContent}>
                                <div className={styles.roundDesc}>
                                    <p>{round.description}</p>
                                </div>



                                {round.id === 1 && (
                                    <div className={styles.detailsGrid}>
                                        <div className={styles.detailCard}>
                                            <h4>Problem Selection</h4>
                                            <p>
                                                Problems are released 1 day before the event. On event day, teams select
                                                their problem on a First-Come-First-Serve basis. Choose from unique problems
                                                (one team only) or common problems (multiple teams can attempt).
                                            </p>
                                        </div>
                                        <div className={styles.detailCard}>
                                            <h4>Prototype Requirements</h4>
                                            <p>
                                                Create wireframes, mockups, or basic demos. No fully functional applications
                                                required. Focus on communicating your solution clearly and demonstrating
                                                its feasibility.
                                            </p>
                                        </div>
                                        <div className={styles.detailCard}>
                                            <h4>Crisis Handling</h4>
                                            <p>
                                                Midway through the round, a surprise crisis scenario will be announced.
                                                Your team must adapt your solution while maintaining its core value proposition.
                                            </p>
                                        </div>
                                        <div className={styles.detailCard}>
                                            <h4>Judging Criteria</h4>
                                            <p>
                                                Solutions are evaluated on practicality, innovation, crisis adaptation,
                                                and presentation quality. Top 30-40 teams advance to Round 2.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {round.id === 2 && (
                                    <div className={styles.detailsGrid}>
                                        <div className={styles.detailCard}>
                                            <h4>Pitch Format</h4>
                                            <p>
                                                Each team gets 90 seconds to pitch their solution to investor-judges.
                                                Be concise, compelling, and confident. You will pitch at multiple tables.
                                            </p>
                                        </div>
                                        <div className={styles.detailCard}>
                                            <h4>Credit System</h4>
                                            <p>
                                                Each judge has virtual credits to allocate. They invest in teams they
                                                believe in. You need a minimum of 5,000 credits from each judge who
                                                invests to be considered for advancement.
                                            </p>
                                        </div>
                                        <div className={styles.detailCard}>
                                            <h4>Strategy Matters</h4>
                                            <p>
                                                Decide which pitch tables to visit, how to allocate your time, and
                                                how to position your solution for different investor interests.
                                            </p>
                                        </div>
                                        <div className={styles.detailCard}>
                                            <h4>Advancement</h4>
                                            <p>
                                                Teams with the highest total credits and meeting minimum thresholds
                                                advance to the final round. Only ~10 teams make it to the boardroom.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {round.id === 3 && (
                                    <div className={styles.detailsGrid}>
                                        <div className={styles.detailCard}>
                                            <h4>Boardroom Setting</h4>
                                            <p>
                                                The final 9-10 teams enter a simulated boardroom environment.
                                                This is high-stakes negotiation where every word counts.
                                            </p>
                                        </div>
                                        <div className={styles.detailCard}>
                                            <h4>Defense Presentation</h4>
                                            <p>
                                                Present your solution, business model, and valuation. Be prepared
                                                to answer tough questions and justify every aspect of your proposal.
                                            </p>
                                        </div>
                                        <div className={styles.detailCard}>
                                            <h4>Negotiation Skills</h4>
                                            <p>
                                                Judges will challenge your assumptions, push back on valuations,
                                                and test your negotiation skills. Stay calm and strategic.
                                            </p>
                                        </div>
                                        <div className={styles.detailCard}>
                                            <h4>Final Scoring</h4>
                                            <p>
                                                Winners are determined by a combination of solution quality,
                                                pitch effectiveness, and negotiation performance.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                ))}

                {/* CTA */}
                <section className={styles.ctaSection}>
                    <div className={styles.container}>
                        <h2 className={styles.ctaTitle}>Ready to Compete?</h2>
                        <p className={styles.ctaDesc}>
                            Register now and prepare for the ultimate hackathon experience.
                        </p>
                        <a href="/register" className={styles.ctaButton}>
                            Register Your Team
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
