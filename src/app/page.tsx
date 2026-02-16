'use client';

import { useEffect, useState } from 'react';
import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Footer from "@/components/Footer/Footer";
import Card, { CardHeader, CardBody, CardFooter } from "@/components/Card/Card";
import Link from "next/link";
import { ROUNDS_DATA, EVENT_CONFIG } from "@/lib/constants";
import styles from "./page.module.css";
import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import MascotGuide from "@/components/MascotGuide";
import { useMascotGuide } from "@/hooks/useMascotGuide";
import { MASCOT_MESSAGES } from "@/lib/mascotData";

export default function Home() {
  const { isVisible, currentMessage, currentMascot, showMessage, dismissMessage, nextMessage, messageQueue } = useMascotGuide('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Show welcome messages on first visit
  useEffect(() => {
    const messages = MASCOT_MESSAGES.home;
    if (messages && messages.length > 0) {
      // Store timeout IDs for cleanup - increased delay for better UX
      const timer1 = setTimeout(() => {
        showMessage(messages[0]);
        // Queue second message if it exists
        if (messages[1]) {
          const timer2 = setTimeout(() => {
            showMessage(messages[1]);
          }, 10000); // Increased: Show after 10 seconds

          // Store timer2 for cleanup
          return () => clearTimeout(timer2);
        }
      }, 3000); // Increased: Wait 3 seconds before showing first message

      // Cleanup on unmount
      return () => clearTimeout(timer1);
    }
  }, [showMessage]);

  return (
    <>
      <Header
        isAuthModalOpen={isAuthModalOpen}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onCloseAuthModal={() => setIsAuthModalOpen(false)}
      />
      <main>
        <Hero onSignInClick={() => setIsAuthModalOpen(true)} />

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

