import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Footer from "@/components/Footer/Footer";
import Card, { CardHeader, CardBody, CardFooter } from "@/components/Card/Card";
import Link from "next/link";
import { ROUNDS_DATA, EVENT_CONFIG } from "@/lib/constants";
import styles from "./page.module.css";
import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* Countdown Section */}
        <section className={styles.section} style={{ padding: 'var(--space-12) 0', background: 'var(--bg-dark)' }}>
          <div className={styles.container} style={{ display: 'flex', justifyContent: 'center' }}>
            <CountdownTimer targetDate={EVENT_CONFIG.eventDate} />
          </div>
        </section>

        {/* How It Works Section */}
        <section className={styles.sectionDark} id="how-it-works">
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
                    <h3 className={styles.roundTitle} style={{ color: round.color }}>Round {round.id}</h3>
                    <span className={styles.roundSubtitle}>{round.subtitle}</span>
                  </div>
                  <div className={styles.roundBody}>
                    <p className={styles.roundDescription}>{round.description}</p>

                    <div className={styles.roundStats}>
                      <span className={styles.statTag}><i className="hn hn-users" /> {round.teams}</span>
                      <span className={styles.statTag}><i className="hn hn-clock" /> {round.duration}</span>
                    </div>


                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
