// Registration service for Firestore operations
import { doc, setDoc, getDoc, deleteDoc, Timestamp, collection, getDocs, updateDoc, query, where, orderBy, limit, startAfter, Query, DocumentData, runTransaction } from 'firebase/firestore';
import { db } from './firebase';
import { FirebaseResult } from './types';

export interface TeamMember {
    name: string;
    email: string;
    phone: string;
}

export interface Registration {
    userId: string;
    userEmail: string; // Email from Firebase Auth (sign-in email)
    teamName: string;
    members: TeamMember[];
    paymentProofURL: string;
    reference?: string; // Volunteer name who referred the user
    timestamp: Timestamp; // Created timestamp
    updatedAt?: Timestamp; // Updated timestamp (set when status changes)
    status: 'pending' | 'approved' | 'rejected';
}

/**
 * Check if user has an existing registration
 * Optimized for free tier - single read operation
 */
export const checkExistingRegistration = async (
    userId: string
): Promise<FirebaseResult<Registration | null>> => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const docRef = doc(db, 'registrations', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                success: true,
                data: docSnap.data() as Registration,
            };
        }

        return {
            success: true,
            data: null,
        };
    } catch (error: any) {
        console.error('Error checking existing registration:', error);
        return {
            success: false,
            error: error.message || 'Failed to check existing registration',
        };
    }
};

/**
 * Save registration to Firestore
 * Uses a transaction to prevent the overwrite race condition:
 *   - If two tabs submit simultaneously, only the first one wins.
 *   - The second attempt sees the doc already exists and aborts.
 */
export const saveRegistration = async (
    userId: string,
    userEmail: string,
    teamName: string,
    members: TeamMember[],
    paymentProofURL: string,
    reference?: string
): Promise<FirebaseResult<void>> => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const firestore = db;

        await runTransaction(firestore, async (transaction) => {
            const docRef = doc(firestore, 'registrations', userId);
            const docSnap = await transaction.get(docRef);

            if (docSnap.exists()) {
                throw new Error('You have already registered! Each user can only register once.');
            }

            const registration: Registration = {
                userId,
                userEmail,
                teamName,
                members,
                paymentProofURL,
                timestamp: Timestamp.now(),
                status: 'pending',
                ...(reference ? { reference } : {}),
            };

            transaction.set(docRef, registration);
        });

        return {
            success: true,
        };
    } catch (error: any) {
        console.error('Error saving registration:', error);
        return {
            success: false,
            error: error.message || 'Failed to save registration',
        };
    }
};

/**
 * Get user's registration
 */
export const getRegistration = async (
    userId: string
): Promise<FirebaseResult<Registration>> => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const docRef = doc(db, 'registrations', userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return {
                success: false,
                error: 'Registration not found',
            };
        }

        return {
            success: true,
            data: docSnap.data() as Registration,
        };
    } catch (error: any) {
        console.error('Error getting registration:', error);
        return {
            success: false,
            error: error.message || 'Failed to get registration',
        };
    }
};

/**
 * Get all registrations (admin only)
 * FREE TIER COMPATIBLE - Efficient query
 */
export const getAllRegistrations = async (): Promise<FirebaseResult<Registration[]>> => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const registrationsRef = collection(db, 'registrations');
        const querySnapshot = await getDocs(registrationsRef);

        const registrations: Registration[] = [];
        querySnapshot.forEach((doc) => {
            registrations.push(doc.data() as Registration);
        });

        // Sort by timestamp (newest first)
        registrations.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

        return {
            success: true,
            data: registrations,
        };
    } catch (error: any) {
        console.error('Error getting all registrations:', error);
        return {
            success: false,
            error: error.message || 'Failed to get registrations',
        };
    }
};

export interface PaginatedRegistrationsResult {
    registrations: Registration[];
    totalCount: number;
    totalParticipants: number;
    hasMore: boolean;
}

/**
 * Get paginated registrations with server-side filtering (admin only)
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @param statusFilter - Filter by status ('all', 'pending', 'approved', 'rejected')
 * @param searchTerm - Search term for team name or member names
 */
export const getPaginatedRegistrations = async (
    page: number = 1,
    pageSize: number = 25,
    statusFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'all',
    searchTerm: string = ''
): Promise<FirebaseResult<PaginatedRegistrationsResult>> => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const registrationsRef = collection(db, 'registrations');

        // Build base query with status filter
        let baseQuery: Query<DocumentData> = query(registrationsRef, orderBy('timestamp', 'desc'));

        if (statusFilter !== 'all') {
            baseQuery = query(registrationsRef, where('status', '==', statusFilter), orderBy('timestamp', 'desc'));
        }

        // For search, we need to fetch all matching docs (Firestore doesn't support text search)
        // Then paginate in-memory
        if (searchTerm) {
            const allSnapshot = await getDocs(baseQuery);
            const allRegistrations: Registration[] = [];

            allSnapshot.forEach((doc) => {
                allRegistrations.push(doc.data() as Registration);
            });

            // Filter by search term (case-insensitive)
            const searchLower = searchTerm.toLowerCase();
            const filtered = allRegistrations.filter(reg =>
                reg.teamName.toLowerCase().includes(searchLower) ||
                reg.members.some(m => m.name.toLowerCase().includes(searchLower))
            );

            // Sum total participants across all matching registrations
            const totalParticipants = allRegistrations.reduce(
                (sum, reg) => sum + (Array.isArray(reg.members) ? reg.members.length : 0),
                0
            );

            // Paginate filtered results
            const totalCount = filtered.length;
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedResults = filtered.slice(startIndex, endIndex);
            const hasMore = endIndex < totalCount;

            return {
                success: true,
                data: {
                    registrations: paginatedResults,
                    totalCount,
                    totalParticipants,
                    hasMore,
                },
            };
        }

        // No search - use efficient Firestore pagination
        // First, get total count and total participants
        const countSnapshot = await getDocs(baseQuery);
        const totalCount = countSnapshot.size;

        // Sum total participants across all registrations
        let totalParticipants = 0;
        countSnapshot.forEach((docSnap) => {
            const data = docSnap.data() as Registration;
            totalParticipants += Array.isArray(data.members) ? data.members.length : 0;
        });

        // Build paginated query
        const startIndex = (page - 1) * pageSize;
        let paginatedQuery = query(baseQuery, limit(pageSize));

        // If not first page, use startAfter cursor
        if (page > 1 && startIndex > 0) {
            const docs = countSnapshot.docs;
            if (startIndex < docs.length) {
                const lastVisibleDoc = docs[startIndex - 1];
                paginatedQuery = query(baseQuery, startAfter(lastVisibleDoc), limit(pageSize));
            }
        }

        const paginatedSnapshot = await getDocs(paginatedQuery);
        const registrations: Registration[] = [];

        paginatedSnapshot.forEach((doc) => {
            registrations.push(doc.data() as Registration);
        });

        const hasMore = (startIndex + pageSize) < totalCount;

        return {
            success: true,
            data: {
                registrations,
                totalCount,
                totalParticipants,
                hasMore,
            },
        };
    } catch (error: any) {
        console.error('Error getting paginated registrations:', error);
        return {
            success: false,
            error: error.message || 'Failed to get paginated registrations',
        };
    }
};


/**
 * Update registration status (admin only)
 * Uses a transaction to prevent concurrent approve/reject race:
 *   - Reads current status first
 *   - Only writes if status is still 'pending' (or the expected previous status)
 */
export const updateRegistrationStatus = async (
    userId: string,
    status: 'pending' | 'approved' | 'rejected'
): Promise<FirebaseResult<void>> => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const firestore = db;

        await runTransaction(firestore, async (transaction) => {
            const docRef = doc(firestore, 'registrations', userId);
            const docSnap = await transaction.get(docRef);

            if (!docSnap.exists()) {
                throw new Error('Registration not found');
            }

            const currentData = docSnap.data() as Registration;

            // Guard: if another admin already changed the status, abort
            if (currentData.status !== 'pending' && status !== 'pending') {
                throw new Error(
                    `This registration has already been ${currentData.status}. ` +
                    `Refresh the page to see the latest status.`
                );
            }

            transaction.update(docRef, {
                status,
                updatedAt: Timestamp.now(),
            });
        });

        return {
            success: true,
        };
    } catch (error: any) {
        console.error('Error updating registration status:', error);
        return {
            success: false,
            error: error.message || 'Failed to update status',
        };
    }
};

/**
 * Delete registration permanently (admin only)
 * WARNING: This action is irreversible
 */
export const deleteRegistration = async (
    userId: string
): Promise<FirebaseResult<void>> => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const docRef = doc(db, 'registrations', userId);
        await deleteDoc(docRef);

        return {
            success: true,
        };
    } catch (error: any) {
        console.error('Error deleting registration:', error);
        return {
            success: false,
            error: error.message || 'Failed to delete registration',
        };
    }
};
