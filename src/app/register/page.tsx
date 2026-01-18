"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import MascotSuccessModal from "@/components/MascotSuccessModal/MascotSuccessModal";
import { MASCOTS, MascotData } from "@/lib/mascotData";

interface TeamMember {
    name: string;
    email: string;
    phone: string;
}

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [teamName, setTeamName] = useState("");
    const [members, setMembers] = useState<TeamMember[]>([
        { name: "", email: "", phone: "" },
        { name: "", email: "", phone: "" },
    ]);
    const [agreedToRules, setAgreedToRules] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [assignedMascot, setAssignedMascot] = useState<MascotData | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const updateMember = (index: number, field: keyof TeamMember, value: string) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const addMember = () => {
        if (members.length < 4) {
            setMembers([...members, { name: "", email: "", phone: "" }]);
        }
    };

    const removeMember = (index: number) => {
        if (members.length > 2) {
            setMembers(members.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Assign Random Mascot
        const randomMascot = MASCOTS[Math.floor(Math.random() * MASCOTS.length)];
        setAssignedMascot(randomMascot);

        setIsSubmitting(false);
        setSubmitted(true);
        setShowSuccessModal(true);
    };

    const isStep1Valid = teamName.length >= 3;
    const isStep2Valid = members.every(m => m.name && m.email);
    const isStep3Valid = agreedToRules;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            // Allow default submission only on the final step
            if (step < 3) {
                e.preventDefault();
                if (step === 1 && isStep1Valid) setStep(2);
                if (step === 2 && isStep2Valid) setStep(3);
            }
        }
    };

    if (submitted) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <section className={styles.successSection}>
                        <div className={styles.successContent}>
                            <div className={styles.successIcon}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <h1 className={styles.successTitle}>Registration Complete!</h1>
                            <p className={styles.successDesc}>
                                Your team <strong>{teamName}</strong> has been registered successfully.
                            </p>
                            <div className={styles.successInfo}>
                                <p>You will receive a confirmation email with further instructions.</p>
                                <p>Problem statements will be released 1 day before the event via our social media channels.</p>
                            </div>
                            <a href="/" className={styles.successButton}>
                                Return Home
                            </a>
                        </div>
                    </section>
                </main>
                <Footer />
                {showSuccessModal && assignedMascot && (
                    <MascotSuccessModal
                        onClose={() => setShowSuccessModal(false)}
                        mascot={assignedMascot}
                    />
                )}
            </>
        );
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <h1 className={styles.pageTitle}>Register Your Team</h1>
                        <p className={styles.pageSubtitle}>
                            Join 150+ teams competing for glory
                        </p>
                    </div>
                </section>

                {/* Registration Form */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        {/* Progress Steps */}
                        <div className={styles.progressBar}>
                            <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ""}`}>
                                <span className={styles.progressNumber}>1</span>
                                <span className={styles.progressLabel}>Team Info</span>
                            </div>
                            <div className={styles.progressLine} />
                            <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ""}`}>
                                <span className={styles.progressNumber}>2</span>
                                <span className={styles.progressLabel}>Members</span>
                            </div>
                            <div className={styles.progressLine} />
                            <div className={`${styles.progressStep} ${step >= 3 ? styles.active : ""}`}>
                                <span className={styles.progressNumber}>3</span>
                                <span className={styles.progressLabel}>Confirm</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form} onKeyDown={handleKeyDown}>
                            {/* Step 1: Team Info */}
                            {step === 1 && (
                                <div className={styles.formStep}>
                                    <h2 className={styles.stepTitle}>Team Information</h2>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Team Name *</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="Enter your team name"
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            required
                                            minLength={3}
                                            maxLength={50}
                                        />
                                        <span className={styles.hint}>Choose a unique and memorable name (3-50 characters)</span>
                                    </div>

                                    <div className={styles.formActions}>
                                        <button
                                            type="button"
                                            className={styles.btnPrimary}
                                            onClick={() => setStep(2)}
                                            disabled={!isStep1Valid}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Team Members */}
                            {step === 2 && (
                                <div className={styles.formStep}>
                                    <h2 className={styles.stepTitle}>Team Members</h2>
                                    <p className={styles.stepDesc}>Add 2-4 team members</p>

                                    {members.map((member, index) => (
                                        <div key={index} className={styles.memberCard}>
                                            <div className={styles.memberHeader}>
                                                <span className={styles.memberNumber}>Member {index + 1}</span>
                                                {members.length > 2 && (
                                                    <button
                                                        type="button"
                                                        className={styles.removeBtn}
                                                        onClick={() => removeMember(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            <div className={styles.memberFields}>
                                                <div className={styles.formGroup}>
                                                    <label className={styles.label}>Full Name *</label>
                                                    <input
                                                        type="text"
                                                        className={styles.input}
                                                        placeholder="Enter full name"
                                                        value={member.name}
                                                        onChange={(e) => updateMember(index, "name", e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label className={styles.label}>Email *</label>
                                                    <input
                                                        type="email"
                                                        className={styles.input}
                                                        placeholder="Enter email address"
                                                        value={member.email}
                                                        onChange={(e) => updateMember(index, "email", e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label className={styles.label}>Phone</label>
                                                    <input
                                                        type="tel"
                                                        className={styles.input}
                                                        placeholder="Enter phone number"
                                                        value={member.phone}
                                                        onChange={(e) => updateMember(index, "phone", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {members.length < 4 && (
                                        <button
                                            type="button"
                                            className={styles.addMemberBtn}
                                            onClick={addMember}
                                        >
                                            + Add Another Member
                                        </button>
                                    )}

                                    <div className={styles.formActions}>
                                        <button
                                            type="button"
                                            className={styles.btnSecondary}
                                            onClick={() => setStep(1)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.btnPrimary}
                                            onClick={() => setStep(3)}
                                            disabled={!isStep2Valid}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Confirm */}
                            {step === 3 && (
                                <div className={styles.formStep}>
                                    <h2 className={styles.stepTitle}>Review & Confirm</h2>

                                    <div className={styles.reviewCard}>
                                        <h3>Team: {teamName}</h3>
                                        <div className={styles.reviewMembers}>
                                            {members.map((member, index) => (
                                                <div key={index} className={styles.reviewMember}>
                                                    <span>{member.name}</span>
                                                    <span className={styles.reviewEmail}>{member.email}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.rulesCard}>
                                        <h3>Event Rules</h3>
                                        <ul className={styles.rulesList}>
                                            <li>All team members must be present on event day</li>
                                            <li>Prototypes must be created on-site during the event</li>
                                            <li>No pre-built solutions or external help allowed</li>
                                            <li>Judges decisions are final</li>
                                            <li>Teams must maintain professional conduct</li>
                                        </ul>

                                        <label className={styles.checkbox}>
                                            <input
                                                type="checkbox"
                                                checked={agreedToRules}
                                                onChange={(e) => setAgreedToRules(e.target.checked)}
                                            />
                                            <span>I agree to the event rules and terms of participation</span>
                                        </label>
                                    </div>

                                    <div className={styles.formActions}>
                                        <button
                                            type="button"
                                            className={styles.btnSecondary}
                                            onClick={() => setStep(2)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className={styles.btnPrimary}
                                            disabled={!isStep3Valid || isSubmitting}
                                        >
                                            {isSubmitting ? "Registering..." : "Complete Registration"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
