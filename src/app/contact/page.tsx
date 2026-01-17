"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { FAQ_DATA } from "@/lib/constants";
import styles from "./page.module.css";

export default function ContactPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <h1 className={styles.pageTitle}>Contact & FAQ</h1>
                        <p className={styles.pageSubtitle}>
                            Have questions? We have got answers.
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
                        <div className={styles.faqList}>
                            {FAQ_DATA.map((faq, index) => (
                                <div
                                    key={index}
                                    className={`${styles.faqItem} ${openFaq === index ? styles.open : ""}`}
                                >
                                    <button
                                        className={styles.faqQuestion}
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        aria-expanded={openFaq === index}
                                    >
                                        <span>{faq.question}</span>
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className={styles.faqIcon}
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </button>
                                    <div className={styles.faqAnswer}>
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className={styles.sectionDark}>
                    <div className={styles.container}>
                        <div className={styles.contactGrid}>
                            {/* Contact Info */}
                            <div className={styles.contactInfo}>
                                <h2 className={styles.sectionTitleLeft}>Get in Touch</h2>
                                <p className={styles.contactDesc}>
                                    Could not find what you are looking for? Reach out to us directly.
                                </p>

                                <div className={styles.contactMethods}>
                                    <div className={styles.contactMethod}>
                                        <div className={styles.contactIcon}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4>Email</h4>
                                            <a href="mailto:contact@technegotia.com">contact@technegotia.com</a>
                                        </div>
                                    </div>

                                    <div className={styles.contactMethod}>
                                        <div className={styles.contactIcon}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4>Instagram</h4>
                                            <a href="https://instagram.com/technegotia" target="_blank" rel="noopener noreferrer">@technegotia</a>
                                        </div>
                                    </div>

                                    <div className={styles.contactMethod}>
                                        <div className={styles.contactIcon}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4>Location</h4>
                                            <p>Main Campus</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className={styles.contactForm}>
                                {submitted ? (
                                    <div className={styles.successMessage}>
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                        <h3>Message Sent!</h3>
                                        <p>We will get back to you soon.</p>
                                        <button
                                            className={styles.btnSecondary}
                                            onClick={() => setSubmitted(false)}
                                        >
                                            Send Another
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Your Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Your Email *</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Subject *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                placeholder="How can we help?"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Message *</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Your message..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className={styles.btnPrimary}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Sending..." : "Send Message"}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
