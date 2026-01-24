"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminLogin, adminLogout } from "@/lib/adminAuth";
import { checkAdminSession, setAdminSession, clearAdminSession } from "@/lib/adminAuthClient";
import { getAllRegistrations, updateRegistrationStatus, Registration, getPaginatedRegistrations, TeamMember } from "@/lib/registrationService";
import { sendApprovalEmail, sendRejectionEmail, initEmailJS } from "@/lib/emailService";
import { exportFilteredRegistrations } from "@/lib/excelExport";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";

export default function AdminPage() {
    const { user } = useAuth();
    const [isAdminAuth, setIsAdminAuth] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    // Initialize EmailJS
    useEffect(() => {
        initEmailJS();
    }, []);

    // Check admin session
    useEffect(() => {
        if (checkAdminSession()) {
            setIsAdminAuth(true);
            loadRegistrations();
        } else {
            setLoading(false);
        }
    }, []);

    // Reload registrations when pagination, filter, or search changes
    useEffect(() => {
        if (isAdminAuth) {
            loadRegistrations();
        }
    }, [currentPage, filter, searchTerm]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if user is signed in with Firebase
        if (!user) {
            alert("Please sign in with your Firebase account first, then access /admin");
            return;
        }

        // Call server-side login action
        const result = await adminLogin(email, password);

        if (result.success) {
            setAdminSession();
            setIsAdminAuth(true);
            loadRegistrations();
        } else {
            alert(result.error || "Invalid admin credentials");
        }
    };

    const handleLogout = async () => {
        await adminLogout();
        clearAdminSession();
        setIsAdminAuth(false);
        setRegistrations([]);
    };

    const loadRegistrations = async () => {
        setLoading(true);
        setError(null);

        // Use server-side pagination
        const result = await getPaginatedRegistrations(
            currentPage,
            pageSize,
            filter,
            searchTerm
        );

        if (result.success && result.data) {
            setRegistrations(result.data.registrations);
            setTotalCount(result.data.totalCount);
            setHasMore(result.data.hasMore);
        } else {
            const errorMsg = result.error || 'Failed to load registrations';
            setError(errorMsg);
            setRegistrations([]);
            setTotalCount(0);
            setHasMore(false);
            alert(`Error: ${errorMsg}`);
        }

        setLoading(false);
    };

    const handleApprove = async (reg: Registration) => {
        if (!confirm(`Approve registration for team "${reg.teamName}"?`)) return;

        console.log('Approving registration:', reg.userId);

        try {
            const result = await updateRegistrationStatus(reg.userId, 'approved');
            console.log('Update result:', result);

            if (result.success) {
                // Send approval email to user's sign-in email
                console.log('Sending approval email to:', reg.userEmail);

                // Safely extract first member name
                const firstMemberName = Array.isArray(reg.members) && reg.members.length > 0
                    ? reg.members[0].name
                    : reg.userEmail || 'Team Member';

                const emailSent = await sendApprovalEmail(
                    reg.teamName,
                    reg.userEmail, // Use sign-in email
                    firstMemberName
                );

                if (emailSent) {
                    alert(`Registration approved! Email sent to ${reg.userEmail}`);
                } else {
                    alert("Registration approved, but email failed to send. Check console for details.");
                }

                loadRegistrations();
            } else {
                alert("Failed to approve registration: " + result.error);
            }
        } catch (error: any) {
            console.error('Error in handleApprove:', error);
            alert("Error approving registration: " + error.message);
        }
    };

    const handleReject = async (reg: Registration) => {
        const reason = prompt(`Reject registration for team "${reg.teamName}"?\n\nOptional reason:`);
        if (reason === null) return; // User cancelled

        console.log('Rejecting registration:', reg.userId);

        try {
            const result = await updateRegistrationStatus(reg.userId, 'rejected');
            console.log('Update result:', result);

            if (result.success) {
                // Send rejection email to user's sign-in email
                console.log('Sending rejection email to:', reg.userEmail);

                // Safely extract first member name
                const firstMemberName = Array.isArray(reg.members) && reg.members.length > 0
                    ? reg.members[0].name
                    : reg.userEmail || 'Team Member';

                const emailSent = await sendRejectionEmail(
                    reg.teamName,
                    reg.userEmail, // Use sign-in email
                    firstMemberName,
                    reason || undefined
                );

                if (emailSent) {
                    alert(`Registration rejected. Email sent to ${reg.userEmail}`);
                } else {
                    alert("Registration rejected, but email failed to send. Check console for details.");
                }

                loadRegistrations();
            } else {
                alert("Failed to reject registration: " + result.error);
            }
        } catch (error: any) {
            console.error('Error in handleReject:', error);
            alert("Error rejecting registration: " + error.message);
        }
    };

    // Pagination handlers
    const handleNextPage = () => {
        if (hasMore) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handlePageJump = (page: number) => {
        setCurrentPage(page);
    };

    // Reset to page 1 when filter or search changes
    const handleFilterChange = (newFilter: 'all' | 'pending' | 'approved' | 'rejected') => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const handleSearchChange = (newSearchTerm: string) => {
        setSearchTerm(newSearchTerm);
        setCurrentPage(1);
    };


    const handleExportToExcel = () => {
        if (registrations.length === 0) {
            alert('No registrations to export!');
            return;
        }

        // Export based on current filter
        exportFilteredRegistrations(registrations, filter);

        const statusText = filter === 'all' ? 'all' : filter;
        alert(`Exported ${totalCount} ${statusText} registration(s) to Excel!`);
    };

    if (!isAdminAuth) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <section className={styles.loginSection}>
                        <div className={styles.loginCard}>
                            <h1>Admin Login</h1>
                            {!user && (
                                <div style={{
                                    padding: '1rem',
                                    backgroundColor: '#fff3cd',
                                    borderRadius: '6px',
                                    marginBottom: '1rem',
                                    border: '2px solid #ffc107'
                                }}>
                                    <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem' }}>
                                        ⚠️ Please sign in with your Firebase account first using the header, then come back to /admin
                                    </p>
                                </div>
                            )}
                            <form onSubmit={handleLogin} className={styles.loginForm}>
                                <div className={styles.formGroup}>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="admin@gmail.com"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Enter password"
                                    />
                                </div>
                                <button type="submit" className={styles.loginButton}>
                                    Login
                                </button>
                            </form>
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
                <section className={styles.adminHeader}>
                    <div className={styles.container}>
                        <div className={styles.headerTop}>
                            <h1>Admin Dashboard</h1>
                            <button onClick={handleLogout} className={styles.logoutButton}>
                                Logout
                            </button>
                        </div>

                        <div className={styles.controls}>
                            <div className={styles.filters}>
                                <button
                                    className={filter === 'all' ? styles.filterActive : ''}
                                    onClick={() => handleFilterChange('all')}
                                >
                                    All ({registrations.length})
                                </button>
                                <button
                                    className={filter === 'pending' ? styles.filterActive : ''}
                                    onClick={() => handleFilterChange('pending')}
                                >
                                    Pending ({registrations.filter(r => r.status === 'pending').length})
                                </button>
                                <button
                                    className={filter === 'approved' ? styles.filterActive : ''}
                                    onClick={() => handleFilterChange('approved')}
                                >
                                    Approved ({registrations.filter(r => r.status === 'approved').length})
                                </button>
                                <button
                                    className={filter === 'rejected' ? styles.filterActive : ''}
                                    onClick={() => handleFilterChange('rejected')}
                                >
                                    Rejected ({registrations.filter(r => r.status === 'rejected').length})
                                </button>
                            </div>

                            <div className={styles.rightControls}>
                                <input
                                    type="text"
                                    placeholder="Search by team or member name..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className={styles.searchInput}
                                />

                                <button
                                    onClick={handleExportToExcel}
                                    className={styles.exportButton}
                                    disabled={registrations.length === 0}
                                >
                                    📊 Export to Excel
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.registrationsSection}>
                    <div className={styles.container}>
                        {loading ? (
                            <p className={styles.loading}>Loading registrations...</p>
                        ) : registrations.length === 0 ? (
                            <p className={styles.noResults}>No registrations found.</p>
                        ) : (
                            <>
                                <div className={styles.registrationList}>
                                    {registrations.map((reg: Registration) => (
                                        <div key={reg.userId} className={styles.registrationCard}>
                                            <div className={styles.cardHeader}>
                                                <h2>{reg.teamName}</h2>
                                                <span className={`${styles.statusBadge} ${styles[reg.status]}`}>
                                                    {reg.status === 'pending' && '⏳ Pending'}
                                                    {reg.status === 'approved' && '✅ Approved'}
                                                    {reg.status === 'rejected' && '❌ Rejected'}
                                                </span>
                                            </div>

                                            <div className={styles.cardBody}>
                                                <div className={styles.section}>
                                                    <h3>Team Members</h3>
                                                    <div className={styles.membersGrid}>
                                                        {reg.members.map((member: TeamMember, idx: number) => (
                                                            <div key={idx} className={styles.member}>
                                                                <strong>Member {idx + 1}</strong>
                                                                <span>👤 {member.name}</span>
                                                                <span>📧 {member.email}</span>
                                                                <span>📱 {member.phone}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className={styles.section}>
                                                    <h3>Payment Proof</h3>
                                                    <img
                                                        src={reg.paymentProofURL}
                                                        alt="Payment proof"
                                                        className={styles.paymentProof}
                                                    />
                                                    <p className={styles.date}>
                                                        Registered: {reg.timestamp.toDate().toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {reg.status === 'pending' && (
                                                <div className={styles.cardActions}>
                                                    <button
                                                        onClick={() => handleApprove(reg)}
                                                        className={styles.approveButton}
                                                    >
                                                        ✅ Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(reg)}
                                                        className={styles.rejectButton}
                                                    >
                                                        ❌ Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {!loading && totalCount > pageSize && (
                                    <div className={styles.paginationControls}>
                                        <div className={styles.paginationInfo}>
                                            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount} registrations
                                        </div>

                                        <div className={styles.paginationButtons}>
                                            <button
                                                onClick={handlePrevPage}
                                                disabled={currentPage === 1}
                                                className={styles.paginationButton}
                                            >
                                                ◀ Previous
                                            </button>

                                            {/* Page numbers */}
                                            <div className={styles.pageNumbers}>
                                                {Array.from({ length: Math.ceil(totalCount / pageSize) }, (_, i) => i + 1)
                                                    .filter(page => {
                                                        // Show first, last, current, and 2 pages around current
                                                        const totalPages = Math.ceil(totalCount / pageSize);
                                                        return (
                                                            page === 1 ||
                                                            page === totalPages ||
                                                            Math.abs(page - currentPage) <= 2
                                                        );
                                                    })
                                                    .map((page, idx, arr) => {
                                                        // Add ellipsis if there's a gap
                                                        const prevPage = arr[idx - 1];
                                                        const showEllipsis = prevPage && page - prevPage > 1;

                                                        return (
                                                            <div key={page} style={{ display: 'flex', gap: '0.5rem' }}>
                                                                {showEllipsis && <span className={styles.ellipsis}>...</span>}
                                                                <button
                                                                    onClick={() => handlePageJump(page)}
                                                                    className={`${styles.pageNumber} ${page === currentPage ? styles.pageNumberActive : ''}`}
                                                                >
                                                                    {page}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                            </div>

                                            <button
                                                onClick={handleNextPage}
                                                disabled={!hasMore}
                                                className={styles.paginationButton}
                                            >
                                                Next ▶
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
