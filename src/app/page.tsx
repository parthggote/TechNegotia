import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Footer from "@/components/Footer/Footer";
import Card, { CardHeader, CardBody, CardFooter } from "@/components/Card/Card";
import Link from "next/link";
import { ROUNDS_DATA, EVENT_CONFIG } from "@/lib/constants";
import styles from "./page.module.css";
import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";
import HowItWorks from "@/components/HowItWorks/HowItWorks";

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
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
