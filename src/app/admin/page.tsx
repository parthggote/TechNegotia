"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminLogin, adminLogout } from "@/lib/adminAuth";
import { checkAdminSession, setAdminSession, clearAdminSession } from "@/lib/adminAuthClient";
import { getAllRegistrations, updateRegistrationStatus, deleteRegistration, Registration, getPaginatedRegistrations, TeamMember } from "@/lib/registrationService";
import { sendApprovalEmail, sendRejectionEmail, initEmailJS } from "@/lib/emailService";
import { exportFilteredRegistrations, ExportFields, defaultExportFields } from "@/lib/excelExport";
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
    const [totalParticipants, setTotalParticipants] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    // Detail modal state
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Export modal state
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [exportFields, setExportFields] = useState<ExportFields>(defaultExportFields);
    const [isExporting, setIsExporting] = useState(false);

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

    /**
     * Handles admin login form submission
     */
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert("Please sign in with your Firebase account first, then access /admin");
            return;
        }

        const result = await adminLogin(email, password);

        if (result.success) {
            setAdminSession();
            setIsAdminAuth(true);
            loadRegistrations();
        } else {
            alert(result.error || "Invalid admin credentials");
        }
    };

    /**
     * Handles admin logout
     */
    const handleLogout = async () => {
        await adminLogout();
        clearAdminSession();
        setIsAdminAuth(false);
        setRegistrations([]);
    };

    /**
     * Loads paginated registrations from the database
     */
    const loadRegistrations = async () => {
        setLoading(true);
        setError(null);

        const result = await getPaginatedRegistrations(
            currentPage,
            pageSize,
            filter,
            searchTerm
        );

        if (result.success && result.data) {
            setRegistrations(result.data.registrations);
            setTotalCount(result.data.totalCount);
            setTotalParticipants(result.data.totalParticipants);
            setHasMore(result.data.hasMore);
        } else {
            const errorMsg = result.error || 'Failed to load registrations';
            setError(errorMsg);
            setRegistrations([]);
            setTotalCount(0);
            setTotalParticipants(0);
            setHasMore(false);
            alert(`Error: ${errorMsg}`);
        }

        setLoading(false);
    };

    /**
     * Opens detail modal for a registration
     */
    const handleViewDetails = (reg: Registration) => {
        setSelectedRegistration(reg);
        setIsModalOpen(true);
    };

    /**
     * Closes the detail modal
     */
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRegistration(null);
    };

    /**
     * Handles approval of a registration
     */
    const handleApprove = async (reg: Registration) => {
        if (!confirm(`Approve registration for team "${reg.teamName}"?`)) return;

        try {
            const result = await updateRegistrationStatus(reg.userId, 'approved');

            if (result.success) {
                const firstMemberName = Array.isArray(reg.members) && reg.members.length > 0
                    ? reg.members[0].name
                    : reg.userEmail || 'Team Member';

                const emailSent = await sendApprovalEmail(
                    reg.teamName,
                    reg.userEmail,
                    firstMemberName
                );

                if (emailSent) {
                    alert(`Registration approved! Email sent to ${reg.userEmail}`);
                } else {
                    alert("Registration approved, but email failed to send.");
                }

                closeModal();
                loadRegistrations();
            } else {
                alert("Failed to approve registration: " + result.error);
            }
        } catch (error: any) {
            alert("Error approving registration: " + error.message);
        }
    };

    /**
     * Handles rejection of a registration
     */
    const handleReject = async (reg: Registration) => {
        const reason = prompt(`Reject registration for team "${reg.teamName}"?\n\nOptional reason:`);
        if (reason === null) return;

        try {
            const result = await updateRegistrationStatus(reg.userId, 'rejected');

            if (result.success) {
                const firstMemberName = Array.isArray(reg.members) && reg.members.length > 0
                    ? reg.members[0].name
                    : reg.userEmail || 'Team Member';

                const emailSent = await sendRejectionEmail(
                    reg.teamName,
                    reg.userEmail,
                    firstMemberName,
                    reason || undefined
                );

                if (emailSent) {
                    alert(`Registration rejected. Email sent to ${reg.userEmail}`);
                } else {
                    alert("Registration rejected, but email failed to send.");
                }

                closeModal();
                loadRegistrations();
            } else {
                alert("Failed to reject registration: " + result.error);
            }
        } catch (error: any) {
            alert("Error rejecting registration: " + error.message);
        }
    };

    // Pagination handlers
    const handleNextPage = () => {
        if (hasMore) setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handlePageJump = (page: number) => {
        setCurrentPage(page);
    };

    /**
     * Handles permanent deletion of a registration
     */
    const handleDelete = async (reg: Registration) => {
        // Double confirmation for safety
        if (!confirm(`⚠️ DELETE registration for team "${reg.teamName}"?\n\nThis action is PERMANENT and cannot be undone!`)) return;
        if (!confirm(`Are you absolutely sure you want to DELETE "${reg.teamName}"?\n\nThis will permanently remove all their data.`)) return;

        try {
            const result = await deleteRegistration(reg.userId);

            if (result.success) {
                alert(`Registration for "${reg.teamName}" has been permanently deleted.`);
                closeModal();
                loadRegistrations();
            } else {
                alert("Failed to delete registration: " + result.error);
            }
        } catch (error: any) {
            alert("Error deleting registration: " + error.message);
        }
    };

    const handleFilterChange = (newFilter: 'all' | 'pending' | 'approved' | 'rejected') => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const handleSearchChange = (newSearchTerm: string) => {
        setSearchTerm(newSearchTerm);
        setCurrentPage(1);
    };

    /**
     * Opens the export options modal
     */
    const openExportModal = () => {
        setIsExportModalOpen(true);
    };

    /**
     * Closes the export modal
     */
    const closeExportModal = () => {
        setIsExportModalOpen(false);
    };

    /**
     * Toggle an export field
     */
    const toggleExportField = (field: keyof ExportFields) => {
        setExportFields(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    /**
     * Select/Deselect all export fields
     */
    const toggleAllExportFields = (selectAll: boolean) => {
        const newFields: ExportFields = {
            serialNumber: selectAll,
            teamName: selectAll,
            status: selectAll,
            teamEmail: selectAll,
            reference: selectAll,
            registrationDate: selectAll,
            memberNames: selectAll,
            memberEmails: selectAll,
            memberPhones: selectAll,
        };
        setExportFields(newFields);
    };

    /**
     * Performs the Excel export with selected fields
     */
    const performExport = async () => {
        setIsExporting(true);
        try {
            // Fetch ALL registrations from database
            const result = await getAllRegistrations();

            if (!result.success || !result.data) {
                alert('Failed to fetch registrations for export: ' + (result.error || 'Unknown error'));
                setIsExporting(false);
                return;
            }

            const allRegistrations = result.data;

            if (allRegistrations.length === 0) {
                alert('No registrations to export!');
                setIsExporting(false);
                return;
            }

            // Apply filter if not 'all'
            const filteredRegistrations = filter === 'all'
                ? allRegistrations
                : allRegistrations.filter(reg => reg.status === filter);

            if (filteredRegistrations.length === 0) {
                alert(`No ${filter} registrations to export!`);
                setIsExporting(false);
                return;
            }

            // Check if at least one field is selected
            const hasSelectedField = Object.values(exportFields).some(v => v);
            if (!hasSelectedField) {
                alert('Please select at least one field to export!');
                setIsExporting(false);
                return;
            }

            exportFilteredRegistrations(filteredRegistrations, filter, exportFields);
            const statusText = filter === 'all' ? 'all' : filter;
            alert(`Exported ${filteredRegistrations.length} ${statusText} registration(s) to Excel!`);
            closeExportModal();
        } catch (error: any) {
            alert('Error exporting registrations: ' + error.message);
        }
        setIsExporting(false);
    };

    /**
     * Gets stats for dashboard cards
     * @returns {{ total: number, pending: number, approved: number, rejected: number, totalParticipants: number }} Dashboard stat values
     */
    const getStats = () => {
        const pending = registrations.filter(r => r.status === 'pending').length;
        const approved = registrations.filter(r => r.status === 'approved').length;
        const rejected = registrations.filter(r => r.status === 'rejected').length;
        return { total: totalCount, pending, approved, rejected, totalParticipants };
    };

    const stats = getStats();

    // ==================== LOGIN PAGE ====================
    if (!isAdminAuth) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <section className={styles.loginSection}>
                        <div className={styles.loginCard}>
                            <div className={styles.loginHeader}>
                                <i className="hn hn-shield"></i>
                                <h1>Admin Portal</h1>
                            </div>

                            {!user && (
                                <div className={styles.warningBanner}>
                                    <i className="hn hn-warning"></i>
                                    <p>Please sign in with Firebase first using the header menu</p>
                                </div>
                            )}

                            <form onSubmit={handleLogin} className={styles.loginForm}>
                                <div className={styles.formGroup}>
                                    <label>
                                        <i className="hn hn-email"></i> Admin Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="admin@example.com"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>
                                        <i className="hn hn-lock"></i> Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Enter password"
                                    />
                                </div>
                                <button type="submit" className={styles.loginButton} disabled={!user}>
                                    <i className="hn hn-arrow-right"></i> Access Dashboard
                                </button>
                            </form>
                        </div>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    // ==================== DASHBOARD ====================
    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Dashboard Header */}
                <section className={styles.dashboardHeader}>
                    <div className={styles.container}>
                        <div className={styles.headerTop}>
                            <div className={styles.headerTitle}>
                                <i className="hn hn-dashboard"></i>
                                <h1>Admin Dashboard</h1>
                            </div>
                            <button onClick={handleLogout} className={styles.logoutButton}>
                                <i className="hn hn-logout"></i> Logout
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className={styles.statsGrid}>
                            <div className={`${styles.statCard} ${styles.statTotal}`}>
                                <div className={styles.statIcon}>
                                    <i className="hn hn-users"></i>
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statNumber}>{stats.total}</span>
                                    <span className={styles.statLabel}>Total Teams</span>
                                </div>
                            </div>
                            <div className={`${styles.statCard} ${styles.statPending}`}>
                                <div className={styles.statIcon}>
                                    <i className="hn hn-clock"></i>
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statNumber}>{stats.pending}</span>
                                    <span className={styles.statLabel}>Pending</span>
                                </div>
                            </div>
                            <div className={`${styles.statCard} ${styles.statApproved}`}>
                                <div className={styles.statIcon}>
                                    <i className="hn hn-check"></i>
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statNumber}>{stats.approved}</span>
                                    <span className={styles.statLabel}>Approved</span>
                                </div>
                            </div>
                            <div className={`${styles.statCard} ${styles.statRejected}`}>
                                <div className={styles.statIcon}>
                                    <i className="hn hn-close"></i>
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statNumber}>{stats.rejected}</span>
                                    <span className={styles.statLabel}>Rejected</span>
                                </div>
                            </div>
                            <div className={`${styles.statCard} ${styles.statParticipants}`}>
                                <div className={styles.statIcon}>
                                    <i className="hn hn-user"></i>
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statNumber}>{stats.totalParticipants}</span>
                                    <span className={styles.statLabel}>Total Participants</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Controls Section */}
                <section className={styles.controlsSection}>
                    <div className={styles.container}>
                        <div className={styles.controls}>
                            <div className={styles.filters}>
                                <button
                                    className={filter === 'all' ? styles.filterActive : ''}
                                    onClick={() => handleFilterChange('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={filter === 'pending' ? styles.filterActive : ''}
                                    onClick={() => handleFilterChange('pending')}
                                >
                                    Pending
                                </button>
                                <button
                                    className={filter === 'approved' ? styles.filterActive : ''}
                                    onClick={() => handleFilterChange('approved')}
                                >
                                    Approved
                                </button>
                                <button
                                    className={filter === 'rejected' ? styles.filterActive : ''}
                                    onClick={() => handleFilterChange('rejected')}
                                >
                                    Rejected
                                </button>
                            </div>

                            <div className={styles.rightControls}>
                                <div className={styles.searchWrapper}>
                                    <i className="hn hn-search"></i>
                                    <input
                                        type="text"
                                        placeholder="Search teams..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        className={styles.searchInput}
                                    />
                                </div>

                                <button
                                    onClick={openExportModal}
                                    className={styles.exportButton}
                                >
                                    <i className="hn hn-download"></i> Export Excel
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Table Section */}
                <section className={styles.tableSection}>
                    <div className={styles.container}>
                        {loading ? (
                            <div className={styles.loadingState}>
                                <i className="hn hn-loading"></i>
                                <p>Loading registrations...</p>
                            </div>
                        ) : registrations.length === 0 ? (
                            <div className={styles.emptyState}>
                                <i className="hn hn-inbox"></i>
                                <p>No registrations found</p>
                            </div>
                        ) : (
                            <>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.dataTable}>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Team Name</th>
                                                <th>Members</th>
                                                <th>Contact Email</th>
                                                <th>Registered</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registrations.map((reg, index) => (
                                                <tr key={reg.userId}>
                                                    <td className={styles.rowNum}>
                                                        {((currentPage - 1) * pageSize) + index + 1}
                                                    </td>
                                                    <td className={styles.teamName}>{reg.teamName}</td>
                                                    <td>{reg.members.length}</td>
                                                    <td className={styles.email}>{reg.userEmail}</td>
                                                    <td className={styles.date}>
                                                        {reg.timestamp.toDate().toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <span className={`${styles.statusBadge} ${styles[reg.status]}`}>
                                                            {reg.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className={styles.viewButton}
                                                            onClick={() => handleViewDetails(reg)}
                                                        >
                                                            <i className="hn hn-eye"></i> View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalCount > pageSize && (
                                    <div className={styles.pagination}>
                                        <span className={styles.paginationInfo}>
                                            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount}
                                        </span>
                                        <div className={styles.paginationButtons}>
                                            <button
                                                onClick={handlePrevPage}
                                                disabled={currentPage === 1}
                                                className={styles.paginationBtn}
                                            >
                                                <i className="hn hn-arrow-left"></i>
                                            </button>
                                            {Array.from({ length: Math.ceil(totalCount / pageSize) }, (_, i) => i + 1)
                                                .filter(page => {
                                                    const totalPages = Math.ceil(totalCount / pageSize);
                                                    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                                                })
                                                .map((page, idx, arr) => {
                                                    const prevPage = arr[idx - 1];
                                                    const showEllipsis = prevPage && page - prevPage > 1;
                                                    return (
                                                        <span key={page} style={{ display: 'flex', alignItems: 'center' }}>
                                                            {showEllipsis && <span className={styles.ellipsis}>...</span>}
                                                            <button
                                                                onClick={() => handlePageJump(page)}
                                                                className={`${styles.pageBtn} ${page === currentPage ? styles.pageBtnActive : ''}`}
                                                            >
                                                                {page}
                                                            </button>
                                                        </span>
                                                    );
                                                })}
                                            <button
                                                onClick={handleNextPage}
                                                disabled={!hasMore}
                                                className={styles.paginationBtn}
                                            >
                                                <i className="hn hn-arrow-right"></i>
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

            {/* Detail Modal */}
            {isModalOpen && selectedRegistration && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>
                                <i className="hn hn-users"></i> {selectedRegistration.teamName}
                            </h2>
                            <button className={styles.modalClose} onClick={closeModal}>
                                <i className="hn hn-close"></i>
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            {/* Status Badge */}
                            <div className={styles.modalStatus}>
                                <span className={`${styles.statusBadgeLarge} ${styles[selectedRegistration.status]}`}>
                                    {selectedRegistration.status === 'pending' && <i className="hn hn-clock"></i>}
                                    {selectedRegistration.status === 'approved' && <i className="hn hn-check"></i>}
                                    {selectedRegistration.status === 'rejected' && <i className="hn hn-close"></i>}
                                    {selectedRegistration.status.toUpperCase()}
                                </span>
                                <span className={styles.modalDate}>
                                    Registered: {selectedRegistration.timestamp.toDate().toLocaleDateString()}
                                </span>
                            </div>

                            {/* Team Members */}
                            <div className={styles.modalSection}>
                                <h3><i className="hn hn-user"></i> Team Members</h3>
                                <div className={styles.membersList}>
                                    {selectedRegistration.members.map((member: TeamMember, idx: number) => (
                                        <div key={idx} className={styles.memberCard}>
                                            <div className={styles.memberNumber}>#{idx + 1}</div>
                                            <div className={styles.memberDetails}>
                                                <span className={styles.memberName}>{member.name}</span>
                                                <span className={styles.memberInfo}>
                                                    <i className="hn hn-email"></i> {member.email}
                                                </span>
                                                <span className={styles.memberInfo}>
                                                    <i className="hn hn-phone"></i> {member.phone}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Proof */}
                            <div className={styles.modalSection}>
                                <h3><i className="hn hn-coin"></i> Payment Proof</h3>
                                <div className={styles.paymentProofWrapper}>
                                    <img
                                        src={selectedRegistration.paymentProofURL}
                                        alt="Payment proof"
                                        className={styles.paymentProofImage}
                                        onClick={() => window.open(selectedRegistration.paymentProofURL, '_blank')}
                                    />
                                    <p className={styles.clickToEnlarge}>Click to enlarge</p>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className={styles.modalSection}>
                                <h3><i className="hn hn-email"></i> Registration Email</h3>
                                <p className={styles.contactEmail}>{selectedRegistration.userEmail}</p>
                            </div>

                            {/* Reference/Referred By */}
                            {selectedRegistration.reference && (
                                <div className={styles.modalSection}>
                                    <h3><i className="hn hn-user"></i> Referred By</h3>
                                    <p className={styles.contactEmail}>{selectedRegistration.reference}</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Actions */}
                        <div className={styles.modalActions}>
                            {selectedRegistration.status === 'pending' && (
                                <>
                                    <button
                                        className={styles.approveBtn}
                                        onClick={() => handleApprove(selectedRegistration)}
                                    >
                                        <i className="hn hn-check"></i> Approve
                                    </button>
                                    <button
                                        className={styles.rejectBtn}
                                        onClick={() => handleReject(selectedRegistration)}
                                    >
                                        <i className="hn hn-close"></i> Reject
                                    </button>
                                </>
                            )}
                            <button
                                className={styles.deleteBtn}
                                onClick={() => handleDelete(selectedRegistration)}
                            >
                                <i className="hn hn-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Options Modal */}
            {isExportModalOpen && (
                <div className={styles.modalOverlay} onClick={closeExportModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>
                                <i className="hn hn-download"></i> Export Options
                            </h2>
                            <button className={styles.modalClose} onClick={closeExportModal}>
                                <i className="hn hn-close"></i>
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <p className={styles.exportDescription}>
                                Select the fields you want to include in the Excel export:
                            </p>

                            {/* Quick Actions */}
                            <div className={styles.exportQuickActions}>
                                <button
                                    type="button"
                                    className={styles.quickSelectBtn}
                                    onClick={() => toggleAllExportFields(true)}
                                >
                                    Select All
                                </button>
                                <button
                                    type="button"
                                    className={styles.quickSelectBtn}
                                    onClick={() => toggleAllExportFields(false)}
                                >
                                    Deselect All
                                </button>
                            </div>

                            {/* Field Checkboxes */}
                            <div className={styles.exportFieldsGrid}>
                                <label className={styles.exportFieldItem}>
                                    <input
                                        type="checkbox"
                                        checked={exportFields.serialNumber}
                                        onChange={() => toggleExportField('serialNumber')}
                                    />
                                    <span>Sr. No.</span>
                                </label>
                                <label className={styles.exportFieldItem}>
                                    <input
                                        type="checkbox"
                                        checked={exportFields.teamName}
                                        onChange={() => toggleExportField('teamName')}
                                    />
                                    <span>Team Name</span>
                                </label>
                                <label className={styles.exportFieldItem}>
                                    <input
                                        type="checkbox"
                                        checked={exportFields.status}
                                        onChange={() => toggleExportField('status')}
                                    />
                                    <span>Status</span>
                                </label>
                                <label className={styles.exportFieldItem}>
                                    <input
                                        type="checkbox"
                                        checked={exportFields.teamEmail}
                                        onChange={() => toggleExportField('teamEmail')}
                                    />
                                    <span>Team Email</span>
                                </label>
                                <label className={styles.exportFieldItem}>
                                    <input
                                        type="checkbox"
                                        checked={exportFields.reference}
                                        onChange={() => toggleExportField('reference')}
                                    />
                                    <span>Reference</span>
                                </label>
                                <label className={styles.exportFieldItem}>
                                    <input
                                        type="checkbox"
                                        checked={exportFields.registrationDate}
                                        onChange={() => toggleExportField('registrationDate')}
                                    />
                                    <span>Registration Date</span>
                                </label>
                                <label className={styles.exportFieldItem}>
                                    <input
                                        type="checkbox"
                                        checked={exportFields.memberNames}
                                        onChange={() => toggleExportField('memberNames')}
                                    />
                                    <span>Member Names</span>
                                </label>
                                <label className={styles.exportFieldItem}>
                                    <input
                                        type="checkbox"
                                        checked={exportFields.memberEmails}
                                        onChange={() => toggleExportField('memberEmails')}
                                    />
                                    <span>Member Emails</span>
                                </label>
                                <label className={styles.exportFieldItem}>
                                    <input
                                        type="checkbox"
                                        checked={exportFields.memberPhones}
                                        onChange={() => toggleExportField('memberPhones')}
                                    />
                                    <span>Member Phones</span>
                                </label>
                            </div>

                            {/* Export Info */}
                            <div className={styles.exportInfo}>
                                <i className="hn hn-info"></i>
                                <span>
                                    Exporting {filter === 'all' ? 'all' : filter} registrations ({totalCount} total)
                                </span>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className={styles.modalActions}>
                            <button
                                className={styles.exportCancelBtn}
                                onClick={closeExportModal}
                                disabled={isExporting}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.exportConfirmBtn}
                                onClick={performExport}
                                disabled={isExporting}
                            >
                                {isExporting ? (
                                    <><i className="hn hn-loading"></i> Exporting...</>
                                ) : (
                                    <><i className="hn hn-download"></i> Export to Excel</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
