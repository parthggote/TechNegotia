import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Footer from "@/components/Footer/Footer";
import Card, { CardHeader, CardBody, CardFooter } from "@/components/Card/Card";
import Link from "next/link";
import { ROUNDS_DATA, EVENT_CONFIG } from "@/lib/constants";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* About Section */}
        <section className={styles.section} id="about">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>What is TechNegotia?</h2>
              <p className={styles.sectionDesc}>
                A multi-round hackathon-style event where problem-solving meets strategic negotiation
              </p>
            </div>

            <div className={styles.aboutGrid}>
              <div className={styles.aboutCard}>
                <div className={styles.aboutIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3>{EVENT_CONFIG.stats.totalTeams}+</h3>
                <p>Teams Compete</p>
              </div>
              <div className={styles.aboutCard}>
                <div className={styles.aboutIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                </div>
                <h3>3 Rounds</h3>
                <p>Progressive Elimination</p>
              </div>
              <div className={styles.aboutCard}>
                <div className={styles.aboutIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3>{EVENT_CONFIG.stats.prizePool}</h3>
                <p>Prize Pool</p>
              </div>
              <div className={styles.aboutCard}>
                <div className={styles.aboutIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                </div>
                <h3>Real Problems</h3>
                <p>Industry Challenges</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rounds Section */}
        <section className={styles.sectionDark} id="rounds">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>The Journey</h2>
              <p className={styles.sectionDesc}>
                Three intense rounds that will test your skills, creativity, and negotiation prowess
              </p>
            </div>

            <div className={styles.roundsGrid}>
              {ROUNDS_DATA.map((round) => (
                <Card
                  key={round.id}
                  variant="featured"
                  accentColor={round.color}
                >
                  <CardHeader
                    title={round.title}
                    subtitle={round.subtitle}
                  />
                  <CardBody>
                    <p className={styles.roundDesc}>{round.description}</p>
                    <div className={styles.roundMeta}>
                      <span className={styles.roundTeams}>{round.teams}</span>
                      <span className={styles.roundDuration}>{round.duration}</span>
                    </div>
                    <ul className={styles.roundHighlights}>
                      {round.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              ))}
            </div>

            <div className={styles.roundsCta}>
              <Link href="/rounds" className={styles.btnSecondary}>
                View Full Details
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className={styles.section} id="how-it-works">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>How It Works</h2>
              <p className={styles.sectionDesc}>
                From problem selection to final negotiation - your path to victory
              </p>
            </div>

            <div className={styles.stepsGrid}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>01</div>
                <h3 className={styles.stepTitle}>Problem Release</h3>
                <p className={styles.stepDesc}>
                  Problem statements released via social media one day before the event. Start strategizing!
                </p>
              </div>
              <div className={styles.stepConnector} />
              <div className={styles.step}>
                <div className={styles.stepNumber}>02</div>
                <h3 className={styles.stepTitle}>Select & Build</h3>
                <p className={styles.stepDesc}>
                  Choose your problem (FCFS), form your team, and build your prototype on event day.
                </p>
              </div>
              <div className={styles.stepConnector} />
              <div className={styles.step}>
                <div className={styles.stepNumber}>03</div>
                <h3 className={styles.stepTitle}>Handle Crisis</h3>
                <p className={styles.stepDesc}>
                  Surprise crisis scenarios will test your adaptability. Pivot and overcome!
                </p>
              </div>
              <div className={styles.stepConnector} />
              <div className={styles.step}>
                <div className={styles.stepNumber}>04</div>
                <h3 className={styles.stepTitle}>Pitch & Negotiate</h3>
                <p className={styles.stepDesc}>
                  Pitch to investors, secure credits, and defend your valuation in the boardroom.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to Begin Your Journey?</h2>
              <p className={styles.ctaDesc}>
                Join {EVENT_CONFIG.stats.totalTeams}+ teams competing for glory and prizes
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/register" className={styles.btnPrimary}>
                  Register Now
                </Link>
                <Link href="/schedule" className={styles.btnSecondary}>
                  View Schedule
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
