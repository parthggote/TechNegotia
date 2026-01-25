"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import MascotSuccessModal from "@/components/MascotSuccessModal/MascotSuccessModal";
import { MASCOTS, MascotData } from "@/lib/mascotData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/Toast";
import { convertImageToBase64 } from "@/lib/firebaseStorage";
import { checkExistingRegistration, saveRegistration, Registration } from "@/lib/registrationService";

/** WhatsApp group invite link */
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/HKLQ5112Cg5AySyJ9uWFZG";


interface TeamMember {
    name: string;
    email: string;
    phone: string;
}

export default function RegisterPage() {
    const { user, loading: authLoading } = useAuth();
    const { showSuccess, showError, showInfo } = useToast();
    const [step, setStep] = useState(1);
    const [teamName, setTeamName] = useState("");
    const [members, setMembers] = useState<TeamMember[]>([
        { name: "", email: "", phone: "" },
    ]);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [paymentProofPreview, setPaymentProofPreview] = useState<string>("");
    const [agreedToRules, setAgreedToRules] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [assignedMascot, setAssignedMascot] = useState<MascotData | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [existingRegistration, setExistingRegistration] = useState<Registration | null>(null);
    const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
    const [registrationCheckError, setRegistrationCheckError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    /**
     * Opens WhatsApp group link in new tab
     */
    const handleJoinWhatsApp = () => {
        showInfo("Opening WhatsApp group...");
        window.open(WHATSAPP_GROUP_LINK, "_blank", "noopener,noreferrer");
    };


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
        if (members.length > 1) {
            setMembers(members.filter((_, i) => i !== index));
        }
    };

    // Check for existing registration on mount
    useEffect(() => {
        const checkRegistration = async () => {
            if (authLoading) return;

            if (!user) {
                setIsCheckingRegistration(false);
                return;
            }

            setRegistrationCheckError(null);
            const result = await checkExistingRegistration(user.uid);

            if (!result.success) {
                // Handle failed check explicitly
                setRegistrationCheckError(result.error || 'Failed to check registration status. Please refresh the page.');
                setIsCheckingRegistration(false);
                return;
            }

            if (result.data) {
                setExistingRegistration(result.data);
            }

            setIsCheckingRegistration(false);
        };

        checkRegistration();
    }, [user, authLoading]);

    // Retry registration check
    const retryRegistrationCheck = () => {
        setIsCheckingRegistration(true);
        setRegistrationCheckError(null);

        const checkRegistration = async () => {
            if (!user) {
                setIsCheckingRegistration(false);
                return;
            }

            const result = await checkExistingRegistration(user.uid);

            if (!result.success) {
                setRegistrationCheckError(result.error || 'Failed to check registration status. Please try again.');
                setIsCheckingRegistration(false);
                return;
            }

            if (result.data) {
                setExistingRegistration(result.data);
            }

            setIsCheckingRegistration(false);
        };

        checkRegistration();
    };

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPG, PNG, or WEBP)');
            e.target.value = '';
            setPaymentProof(null);
            setPaymentProofPreview('');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            e.target.value = '';
            setPaymentProof(null);
            setPaymentProofPreview('');
            return;
        }

        setPaymentProof(file);

        // Generate preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPaymentProofPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            showError('Please sign in to register');
            return;
        }

        if (!paymentProof) {
            showError('Please upload payment proof');
            return;
        }

        setIsSubmitting(true);
        setUploadProgress(10);

        try {
            // Convert image to Base64
            setUploadProgress(30);
            const uploadResult = await convertImageToBase64(paymentProof);

            if (!uploadResult.success || !uploadResult.data) {
                throw new Error(uploadResult.error || 'Failed to process image');
            }

            setUploadProgress(60);

            // Save registration to Firestore with Base64 image
            const saveResult = await saveRegistration(
                user.uid,
                user.email || '',
                teamName,
                members,
                uploadResult.data
            );

            if (!saveResult.success) {
                throw new Error(saveResult.error || 'Failed to save registration');
            }

            setUploadProgress(100);

            // Assign Random Mascot
            const randomMascot = MASCOTS[Math.floor(Math.random() * MASCOTS.length)];
            setAssignedMascot(randomMascot);

            setIsSubmitting(false);
            setSubmitted(true);
            setShowSuccessModal(true);
            showSuccess('Registration completed successfully!');
        } catch (error: any) {
            console.error('Registration error:', error);
            showError(error.message || 'Failed to complete registration. Please try again.');
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    const isStep1Valid = teamName.length >= 3;
    const isStep2Valid = members.every(m => m.name && m.email && m.phone && /^\d{10}$/.test(m.phone));
    const isStep3Valid = agreedToRules && paymentProof !== null;

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

                            {/* WhatsApp Group Join Button - Primary CTA */}
                            <button
                                onClick={handleJoinWhatsApp}
                                className={styles.whatsappButton}
                            >
                                <i className="hn hn-chat"></i>
                                Join WhatsApp Group
                                <i className="hn hn-arrow-right"></i>
                            </button>

                            <a href="/" className={styles.successButtonSecondary}>
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

    // Show loading while checking registration
    if (isCheckingRegistration || authLoading) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <section className={styles.hero}>
                        <div className={styles.container}>
                            <h1 className={styles.pageTitle}>Loading...</h1>
                            <p className={styles.pageSubtitle}>Checking your registration status</p>
                        </div>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    // Show existing registration if found
    if (existingRegistration) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <section className={styles.hero}>
                        <div className={styles.container}>
                            <h1 className={styles.pageTitle}>Already Registered <i className="hn hn-check"></i></h1>
                            <p className={styles.pageSubtitle}>You have successfully registered for this event</p>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.container}>
                            <div className={styles.reviewCard}>
                                <h2>Team: {existingRegistration.teamName}</h2>
                                <div className={styles.reviewMembers}>
                                    <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Team Members:</h3>
                                    {existingRegistration.members.map((member, index) => (
                                        <div key={index} className={styles.reviewMember}>
                                            <span><strong>Member {index + 1}:</strong> {member.name}</span>
                                            <span className={styles.reviewEmail}>{member.email}</span>
                                            <span>{member.phone}</span>
                                        </div>
                                    ))}
                                </div>
                                {existingRegistration.paymentProofURL && (
                                    <div style={{ marginTop: '2rem' }}>
                                        <h3>Payment Proof:</h3>
                                        <img
                                            src={existingRegistration.paymentProofURL}
                                            alt="Payment proof"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '400px',
                                                marginTop: '1rem',
                                                border: '2px solid #ccc',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </div>
                                )}
                                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                                    <p style={{ margin: 0, color: '#666' }}>
                                        <strong>Registration Date:</strong> {existingRegistration.timestamp.toDate().toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                                        <strong>Status:</strong> {existingRegistration.status === 'pending' ? 'Pending Review' : existingRegistration.status === 'approved' ? 'Approved' : 'Rejected'}
                                    </p>
                                </div>
                                <p style={{ marginTop: '1.5rem', fontSize: '0.95rem' }}>
                                    To modify your registration, please contact the organizers.
                                </p>
                                <a href="/" className={styles.successButton} style={{ display: 'inline-block', marginTop: '1.5rem' }}>
                                    Return Home
                                </a>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    // Show error state if registration check failed
    if (registrationCheckError) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <section className={styles.hero}>
                        <div className={styles.container}>
                            <h1 className={styles.pageTitle}><i className="hn hn-warning"></i> Error</h1>
                            <p className={styles.pageSubtitle}>Unable to verify registration status</p>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.container}>
                            <div className={styles.reviewCard} style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                                <div style={{
                                    padding: '1.5rem',
                                    backgroundColor: '#fff3cd',
                                    borderRadius: '8px',
                                    border: '2px solid #ffc107',
                                    marginBottom: '2rem'
                                }}>
                                    <p style={{ margin: 0, color: '#856404', fontSize: '1rem' }}>
                                        {registrationCheckError}
                                    </p>
                                </div>
                                <p style={{ marginBottom: '2rem', color: '#666' }}>
                                    We need to verify your registration status before you can proceed.
                                    Please try again or contact support if the problem persists.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={retryRegistrationCheck}
                                        className={styles.btnPrimary}
                                        style={{ minWidth: '150px' }}
                                    >
                                        <i className="hn hn-refresh"></i> Retry
                                    </button>
                                    <a
                                        href="/"
                                        className={styles.btnSecondary}
                                        style={{ display: 'inline-block', minWidth: '150px', textDecoration: 'none', textAlign: 'center' }}
                                    >
                                        Return Home
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
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
                                <span className={styles.progressLabel}>Payment</span>
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
                                    <p className={styles.stepDesc}>Add 1-4 team members</p>

                                    {members.map((member, index) => (
                                        <div key={index} className={styles.memberCard}>
                                            <div className={styles.memberHeader}>
                                                <span className={styles.memberNumber}>Member {index + 1}</span>
                                                {members.length > 1 && index > 0 && (
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
                                                        placeholder="Enter email address (e.g., user@example.com)"
                                                        value={member.email}
                                                        onChange={(e) => updateMember(index, "email", e.target.value)}
                                                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                                                        title="Please enter a valid email address (e.g., user@example.com)"
                                                        required
                                                    />
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label className={styles.label}>Phone *</label>
                                                    <input
                                                        type="tel"
                                                        className={styles.input}
                                                        placeholder="Enter 10-digit phone number"
                                                        value={member.phone}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, '');
                                                            if (value.length <= 10) {
                                                                updateMember(index, "phone", value);
                                                            }
                                                        }}
                                                        pattern="\d{10}"
                                                        minLength={10}
                                                        maxLength={10}
                                                        title="Please enter a valid phone number"
                                                        required
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

                            {/* Step 3: Payment & Confirm */}
                            {step === 3 && (
                                <div className={styles.formStep}>
                                    <h2 className={styles.stepTitle}>Payment & Confirm</h2>

                                    {/* Team Review */}
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

                                    {/* Payment Screenshot Upload Section */}
                                    <div className={styles.paymentCard}>
                                        <div className={styles.paymentHeader}>
                                            <i className="hn hn-upload"></i>
                                            <div>
                                                <h3>Upload Payment Proof</h3>
                                                <p>Upload screenshot of your payment</p>
                                            </div>
                                        </div>

                                        <div className={styles.paymentUpload}>
                                            <label className={styles.uploadLabel}>
                                                <i className="hn hn-image"></i>
                                                Payment Screenshot *
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handleFileChange}
                                                required
                                                className={styles.fileInput}
                                            />
                                            {paymentProofPreview && (
                                                <div className={styles.previewContainer}>
                                                    <p className={styles.previewLabel}>Preview:</p>
                                                    <img
                                                        src={paymentProofPreview}
                                                        alt="Payment proof preview"
                                                        className={styles.previewImage}
                                                    />
                                                </div>
                                            )}
                                            {uploadProgress > 0 && uploadProgress < 100 && (
                                                <div className={styles.progressContainer}>
                                                    <div className={styles.progressBarUpload}>
                                                        <div 
                                                            className={styles.progressFill}
                                                            style={{ width: `${uploadProgress}%` }}
                                                        />
                                                    </div>
                                                    <p className={styles.progressText}>
                                                        Uploading... {uploadProgress}%
                                                    </p>
                                                </div>
                                            )}
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
