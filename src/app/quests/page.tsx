"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Registration, checkExistingRegistration } from "@/lib/registrationService";
import {
    ProblemStatement,
    subscribeToProblemStatements,
    selectProblemStatement,
    getUserQuestSelection,
    QuestSelection,
} from "@/lib/questService";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";

export default function QuestsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    // Quest data
    const [statements, setStatements] = useState<ProblemStatement[]>([]);
    const [loading, setLoading] = useState(true);
    const [userSelection, setUserSelection] = useState<{
        statement: ProblemStatement;
        selection: QuestSelection;
    } | null>(null);
    const [teamName, setTeamName] = useState("");
    const [registration, setRegistration] = useState<Registration | null | undefined>(undefined);
    const [regLoading, setRegLoading] = useState(true);

    // Modal state
    const [selectedQuest, setSelectedQuest] = useState<ProblemStatement | null>(null);
    const [isModalClosing, setIsModalClosing] = useState(false);
    const [selecting, setSelecting] = useState(false);

    // UI state
    const [showPortal, setShowPortal] = useState(true);
    const [showContent, setShowContent] = useState(false);

    // Double-click protection
    const selectingRef = useRef(false);

    // Portal animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPortal(false);
            setTimeout(() => setShowContent(true), 100);
        }, 2300);
        return () => clearTimeout(timer);
    }, []);

    // Real-time quest listener — auto-updates slot counts
    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToProblemStatements(
            (allStatements) => {
                setStatements(allStatements.filter(s => s.isActive));
                setLoading(false);
            },
            (error) => {
                console.error('Quest listener error:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe(); // Cleanup on unmount
    }, [user]);

    // Keep the modal in sync with real-time data
    // Without this, the modal shows stale slot counts while other users fill slots
    useEffect(() => {
        if (selectedQuest && selectedQuest.id) {
            const updated = statements.find(s => s.id === selectedQuest.id);
            if (updated) {
                setSelectedQuest(updated);
            }
        }
    }, [statements]); // eslint-disable-line react-hooks/exhaustive-deps

    // Load user-specific data once (selection + team name + registration)
    const loadUserData = useCallback(async () => {
        if (!user) return;

        setRegLoading(true);

        try {
            const regResult = await checkExistingRegistration(user.uid);
            if (regResult.success && regResult.data) {
                setRegistration(regResult.data);
                setTeamName(regResult.data.teamName);
            } else {
                setRegistration(null);
            }

            const selectionResult = await getUserQuestSelection(user.uid);
            if (selectionResult.success && selectionResult.data) {
                setUserSelection(selectionResult.data);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
        setRegLoading(false);
    }, [user]);

    useEffect(() => {
        if (user) {
            loadUserData();
        }
    }, [user, loadUserData]);

    // Handle quest selection
    const handleSelectQuest = async (statement: ProblemStatement) => {
        if (!user || !statement.id || selectingRef.current) return;

        selectingRef.current = true;
        setSelecting(true);

        try {
            const result = await selectProblemStatement(
                user.uid,
                teamName,
                user.email || "",
                statement.id
            );

            if (result.success) {
                // Reload user data to show the new selection
                await loadUserData();
                closeModal();
            } else {
                alert(result.error || "Failed to select quest");
            }
        } catch (error: any) {
            alert(error.message || "An error occurred");
        }

        setSelecting(false);
        selectingRef.current = false;
    };

    // Modal controls
    const openModal = (quest: ProblemStatement) => {
        setSelectedQuest(quest);
    };

    const closeModal = () => {
        setIsModalClosing(true);
        setTimeout(() => {
            setSelectedQuest(null);
            setIsModalClosing(false);
        }, 300);
    };

    // ==================== PORTAL ANIMATION ====================
    if (showPortal) {
        return (
            <div className={styles.portalScreen}>
                <div className={styles.portalRing}>
                    <div className={styles.portalInner}>
                        <div className={styles.portalGlow}></div>
                    </div>
                </div>
                <div className={styles.portalText}>Entering Quest Board...</div>
                <div className={styles.portalParticles}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div
                            key={i}
                            className={styles.particle}
                            style={{
                                '--angle': `${i * 30}deg`,
                                '--delay': `${i * 0.12}s`,
                            } as React.CSSProperties}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // ==================== AUTH LOADING ====================
    if (authLoading) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.pixelLoader}></div>
                        <span>Verifying adventurer credentials...</span>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // ==================== NOT SIGNED IN ====================
    if (!user) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={`${styles.authGate} ${showContent ? styles.fadeIn : ''}`}>
                        <div className={styles.gateIcon}>🔒</div>
                        <h1 className={styles.gateTitle}>Quest Board Locked</h1>
                        <p className={styles.gateText}>
                            Only authenticated adventurers may access the quest board.
                            Sign in to prove your identity.
                        </p>
                        <button
                            className={styles.gateButton}
                            onClick={() => router.push('/')}
                        >
                            ⚔️ Return to Base Camp
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // ==================== REGISTRATION LOADING ====================
    if (regLoading) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.pixelLoader}></div>
                        <span>Checking registration status...</span>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // ==================== NOT REGISTERED ====================
    if (!registration) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={`${styles.authGate} ${showContent ? styles.fadeIn : ''}`}>
                        <div className={styles.gateIcon}>⛔</div>
                        <h1 className={styles.gateTitle}>Registrations Closed</h1>
                        <p className={styles.gateText}>
                            Sorry Adventurer, the quest portal has been sealed!
                            Registrations are no longer open.
                        </p>
                        <button
                            className={styles.gateButton}
                            onClick={() => router.push('/')}
                        >
                            ⚔️ Return to Base Camp
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // ==================== PENDING / REJECTED ====================
    if (registration.status !== 'approved') {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={`${styles.authGate} ${showContent ? styles.fadeIn : ''}`}>
                        <div className={styles.gateIcon}>
                            {registration.status === 'pending' ? '⏳' : '❌'}
                        </div>
                        <h1 className={styles.gateTitle}>
                            {registration.status === 'pending'
                                ? 'Awaiting Approval'
                                : 'Registration Rejected'}
                        </h1>
                        <p className={styles.gateText}>
                            {registration.status === 'pending'
                                ? 'Your registration is being reviewed. Once approved, the quest board will unlock for your team.'
                                : 'Unfortunately your registration was not approved. Please contact the organizers for more information.'}
                        </p>
                        <button
                            className={styles.gateButton}
                            onClick={() => router.push('/')}
                        >
                            ⚔️ Return to Base Camp
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // ==================== APPROVED — QUEST BOARD ====================
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.scanlines}></div>

                {/* Quest Header */}
                <section className={`${styles.questHeader} ${showContent ? styles.fadeIn : ''}`}>
                    <div className={styles.container}>
                        <div className={styles.headerDecor}>
                            <span className={styles.decorSword}>⚔️</span>
                            <h1 className={styles.headerTitle}>Quest Board</h1>
                            <span className={styles.decorSword}>⚔️</span>
                        </div>
                        <p className={styles.headerSubtitle}>
                            Choose your quest wisely, adventurer. Each team may only select one problem statement.
                        </p>
                        {teamName && (
                            <div className={styles.teamBadge}>
                                <span className={styles.teamBadgeIcon}>🛡️</span>
                                <span>Team: {teamName}</span>
                            </div>
                        )}
                    </div>
                </section>


                {/* Selection Banner (if user already selected) */}
                {userSelection && (
                    <section className={`${styles.selectionBanner} ${showContent ? styles.fadeIn : ''}`}>
                        <div className={styles.container}>
                            <div className={styles.bannerContent}>
                                <div className={styles.bannerIcon}>🏆</div>
                                <div className={styles.bannerInfo}>
                                    <h2 className={styles.bannerTitle}>✦ QUEST ACCEPTED ✦</h2>
                                    <p className={styles.bannerQuest}>{userSelection.statement.title}</p>
                                    <p className={styles.bannerDesc}>{userSelection.statement.description}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Quest Grid */}
                <section className={`${styles.questSection} ${showContent ? styles.fadeIn : ''}`}>
                    <div className={styles.container}>
                        {loading ? (
                            <div className={styles.loadingContainer}>
                                <div className={styles.pixelLoader}></div>
                                <span>Loading quests...</span>
                            </div>
                        ) : statements.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>📜</div>
                                <h2>No Quests Available</h2>
                                <p>The quest board is currently empty. Check back later!</p>
                            </div>
                        ) : (
                            <div className={styles.questGrid}>
                                {statements.map((stmt, index) => {
                                    const isFull = (stmt.selectedBy?.length || 0) >= stmt.maxTeams;
                                    const isSelected = userSelection?.statement.id === stmt.id;

                                    return (
                                        <div
                                            key={stmt.id}
                                            className={`${styles.questCard} ${isFull ? styles.questFull : ''} ${isSelected ? styles.questSelected : ''}`}
                                            style={{ animationDelay: `${index * 0.08}s` }}
                                            onClick={() => !isFull && openModal(stmt)}
                                        >
                                            {/* Full overlay */}
                                            {isFull && (
                                                <div className={styles.fullOverlay}>
                                                    <span className={styles.fullText}>Quest Full</span>
                                                </div>
                                            )}

                                            {/* Selected badge */}
                                            {isSelected && (
                                                <div className={styles.selectedBadge}>
                                                    ✦ YOUR QUEST ✦
                                                </div>
                                            )}

                                            <span className={styles.questNumber}>#{index + 1}</span>

                                            <h3 className={styles.questTitle}>{stmt.title}</h3>
                                            <p className={styles.questSummary}>
                                                {stmt.description.length > 80
                                                    ? stmt.description.substring(0, 80) + '...'
                                                    : stmt.description}
                                            </p>

                                            <div className={styles.cardFooter}>
                                                <span className={styles.slotMini}>
                                                    {stmt.selectedBy?.length || 0}/{stmt.maxTeams} teams
                                                </span>
                                                {!isFull && !isSelected && (
                                                    <span className={styles.tapHint}>TAP TO VIEW</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />

            {/* ==================== SOLO LEVELING MODAL ==================== */}
            {selectedQuest && (
                <div
                    className={`${styles.slOverlay} ${isModalClosing ? styles.slOverlayClosing : ''}`}
                    onClick={(e) => e.target === e.currentTarget && closeModal()}
                >
                    {/* Floating particles */}
                    <div className={styles.slParticles}>
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={i}
                                className={styles.slParticle}
                                style={{
                                    '--x': `${Math.random() * 100}%`,
                                    '--y': `${Math.random() * 100}%`,
                                    '--size': `${3 + Math.random() * 5}px`,
                                    '--dur': `${3 + Math.random() * 4}s`,
                                    '--delay': `${Math.random() * 3}s`,
                                } as React.CSSProperties}
                            />
                        ))}
                    </div>

                    <div className={`${styles.slModal} ${isModalClosing ? styles.slModalClosing : ''}`}>
                        {/* Top glow line */}
                        <div className={styles.slGlowLine}></div>

                        {/* Header */}
                        <div className={styles.slHeader}>
                            <div className={styles.slHeaderText}>
                                <span className={styles.slQuestLabel}>Problem Statement</span>
                                <h2 className={styles.slTitle}>{selectedQuest.title}</h2>
                            </div>
                            <button className={styles.slClose} onClick={closeModal}>✕</button>
                        </div>

                        <div className={styles.slDivider}>
                            <div className={styles.slDividerGlow}></div>
                        </div>

                        {/* Body */}
                        <div className={styles.slBody}>
                            {/* Description */}
                            <div className={styles.slSection}>
                                <div className={styles.slSectionTitle}>
                                    <span className={styles.slIcon}>📜</span>
                                    <span>Description</span>
                                </div>
                                <p className={styles.slDescription}>{selectedQuest.description}</p>
                            </div>

                            {/* Stats */}
                            <div className={styles.slStats}>
                                <div className={styles.slStat}>
                                    <span className={styles.slStatLabel}>Teams Joined</span>
                                    <span className={styles.slStatValue}>
                                        {selectedQuest.selectedBy?.length || 0}
                                    </span>
                                </div>
                                <div className={styles.slStat}>
                                    <span className={styles.slStatLabel}>Max Teams</span>
                                    <span className={styles.slStatValue}>{selectedQuest.maxTeams}</span>
                                </div>
                                <div className={styles.slStat}>
                                    <span className={styles.slStatLabel}>Slots Left</span>
                                    <span className={`${styles.slStatValue} ${(selectedQuest.maxTeams - (selectedQuest.selectedBy?.length || 0)) <= 2 ? styles.slStatWarn : ''}`}>
                                        {selectedQuest.maxTeams - (selectedQuest.selectedBy?.length || 0)}
                                    </span>
                                </div>
                                <div className={styles.slStat}>
                                    <span className={styles.slStatLabel}>Status</span>
                                    <span className={styles.slStatValue}>
                                        {(selectedQuest.selectedBy?.length || 0) >= selectedQuest.maxTeams
                                            ? '🔴 Full'
                                            : '🟢 Open'}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className={styles.slProgressSection}>
                                <div className={styles.slProgressLabel}>
                                    <span>Capacity</span>
                                    <span>
                                        {selectedQuest.selectedBy?.length || 0} / {selectedQuest.maxTeams}
                                    </span>
                                </div>
                                <div className={styles.slProgressBar}>
                                    <div
                                        className={`${styles.slProgressFill} ${((selectedQuest.selectedBy?.length || 0) / selectedQuest.maxTeams) > 0.8 ? styles.slProgressDanger : ''}`}
                                        style={{
                                            width: `${Math.min(((selectedQuest.selectedBy?.length || 0) / selectedQuest.maxTeams) * 100, 100)}%`,
                                        }}
                                    >
                                        <div className={styles.slProgressShine}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.slGlowLineBottom}></div>

                        {/* Footer */}
                        <div className={styles.slFooter}>
                            {/* Already selected this quest */}
                            {userSelection?.statement.id === selectedQuest.id ? (
                                <div className={styles.slAccepted}>
                                    ✦ QUEST ACCEPTED — This is your team&apos;s quest ✦
                                </div>
                            ) : userSelection ? (
                                /* Already selected a different quest */
                                <div className={styles.slAlready}>
                                    You have already selected a quest. Each team can only choose one.
                                </div>
                            ) : (selectedQuest.selectedBy?.length || 0) >= selectedQuest.maxTeams ? (
                                /* Quest is full */
                                <div className={styles.slClosed}>
                                    ⛔ This quest has reached maximum capacity
                                </div>
                            ) : (
                                /* Can select */
                                <button
                                    className={`${styles.slAcceptButton} ${selecting ? styles.slBtnLoading : ''}`}
                                    onClick={() => handleSelectQuest(selectedQuest)}
                                    disabled={selecting}
                                >
                                    <div className={styles.slBtnGlow}></div>
                                    <span className={styles.slBtnText}>
                                        {selecting ? 'Accepting Quest...' : '⚔️ Accept This Quest'}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
