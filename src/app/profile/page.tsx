'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getRegistration, Registration } from '@/lib/registrationService';
import { getUserQuestSelection, ProblemStatement, QuestSelection } from '@/lib/questService';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [registration, setRegistration] = useState<Registration | null>(null);
    const [questData, setQuestData] = useState<{
        statement: ProblemStatement;
        selection: QuestSelection;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

    // Fade-in animation
    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Load user data
    useEffect(() => {
        if (!user) return;

        const loadProfile = async () => {
            setLoading(true);
            try {
                const [regResult, questResult] = await Promise.all([
                    getRegistration(user.uid),
                    getUserQuestSelection(user.uid),
                ]);

                if (regResult.success && regResult.data) {
                    setRegistration(regResult.data);
                }
                if (questResult.success && questResult.data) {
                    setQuestData(questResult.data);
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            }
            setLoading(false);
        };

        loadProfile();
    }, [user]);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '—';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'approved':
                return { label: 'APPROVED', icon: '✅', className: styles.statusApproved };
            case 'rejected':
                return { label: 'REJECTED', icon: '❌', className: styles.statusRejected };
            default:
                return { label: 'PENDING', icon: '⏳', className: styles.statusPending };
        }
    };

    // Auth loading
    if (authLoading) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.pixelLoader} />
                        <p>Loading...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Not signed in
    if (!user) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={`${styles.authGate} ${showContent ? styles.fadeIn : ''}`}>
                        <div className={styles.gateIcon}>🔒</div>
                        <h1 className={styles.gateTitle}>Profile Locked</h1>
                        <p className={styles.gateText}>
                            Sign in to view your adventurer profile.
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

    return (
        <>
            <Header />
            <main className={`${styles.main} ${showContent ? styles.fadeIn : ''}`}>
                {/* Scanlines */}
                <div className={styles.scanlines} />

                {/* Profile Header */}
                <section className={styles.profileHeader}>
                    <div className={styles.container}>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatar}>
                                <span className={styles.avatarText}>
                                    {user.displayName?.[0] || user.email?.[0] || '?'}
                                </span>
                                <div className={styles.avatarGlow} />
                            </div>
                            <div className={styles.headerInfo}>
                                <h1 className={styles.userName}>
                                    {user.displayName || 'Adventurer'}
                                </h1>
                                <p className={styles.userEmail}>{user.email}</p>
                                {registration && (
                                    <div className={styles.teamTag}>
                                        <span>🛡️</span>
                                        <span>Team: <strong>{registration.teamName}</strong></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.pixelLoader} />
                        <p>Loading profile data...</p>
                    </div>
                ) : !registration ? (
                    <section className={styles.noRegSection}>
                        <div className={styles.container}>
                            <div className={styles.noRegCard}>
                                <span className={styles.noRegIcon}>📋</span>
                                <h2 className={styles.noRegTitle}>No Registration Found</h2>
                                <p className={styles.noRegText}>
                                    You haven&apos;t registered for the event yet.
                                </p>
                                <button
                                    className={styles.gateButton}
                                    onClick={() => router.push('/register')}
                                >
                                    📝 Register Now
                                </button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <div className={styles.profileContent}>
                        <div className={styles.container}>
                            <div className={styles.cardsGrid}>

                                {/* Registration Status Card */}
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.cardIcon}>📊</span>
                                        <h2 className={styles.cardTitle}>Registration Status</h2>
                                    </div>
                                    <div className={styles.cardBody}>
                                        <div className={`${styles.statusBadge} ${getStatusConfig(registration.status).className}`}>
                                            <span>{getStatusConfig(registration.status).icon}</span>
                                            <span>{getStatusConfig(registration.status).label}</span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>Registered</span>
                                            <span className={styles.infoValue}>{formatDate(registration.timestamp)}</span>
                                        </div>
                                        {registration.reference && (
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>Referred By</span>
                                                <span className={styles.infoValue}>{registration.reference}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quest Selection Card */}
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.cardIcon}>⚔️</span>
                                        <h2 className={styles.cardTitle}>Selected Quest</h2>
                                    </div>
                                    <div className={styles.cardBody}>
                                        {questData ? (
                                            <>
                                                <h3 className={styles.questName}>{questData.statement.title}</h3>
                                                <p className={styles.questDesc}>{questData.statement.description}</p>
                                                <div className={styles.infoRow}>
                                                    <span className={styles.infoLabel}>Selected On</span>
                                                    <span className={styles.infoValue}>{formatDate(questData.selection.selectedAt)}</span>
                                                </div>
                                                <div className={styles.infoRow}>
                                                    <span className={styles.infoLabel}>Teams Joined</span>
                                                    <span className={styles.infoValue}>
                                                        {questData.statement.selectedBy?.length || 0} / {questData.statement.maxTeams}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className={styles.noQuest}>
                                                <span className={styles.noQuestIcon}>📜</span>
                                                <p>No quest selected yet</p>
                                                <button
                                                    className={styles.questLink}
                                                    onClick={() => router.push('/quests')}
                                                >
                                                    Browse Quests →
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Team Members Card */}
                                <div className={`${styles.card} ${styles.cardWide}`}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.cardIcon}>👥</span>
                                        <h2 className={styles.cardTitle}>Team Members</h2>
                                        <span className={styles.memberCount}>
                                            {registration.members.length} member{registration.members.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className={styles.cardBody}>
                                        <div className={styles.membersGrid}>
                                            {registration.members.map((member, idx) => (
                                                <div key={idx} className={styles.memberCard}>
                                                    <div className={styles.memberAvatar}>
                                                        {member.name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <div className={styles.memberInfo}>
                                                        <h4 className={styles.memberName}>
                                                            {member.name}
                                                            {idx === 0 && (
                                                                <span className={styles.leaderBadge}>LEADER</span>
                                                            )}
                                                        </h4>
                                                        <p className={styles.memberDetail}>
                                                            <span>📧</span> {member.email}
                                                        </p>
                                                        <p className={styles.memberDetail}>
                                                            <span>📱</span> {member.phone}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
