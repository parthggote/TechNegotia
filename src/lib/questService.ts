// Quest / Problem Statement Service for Firestore operations
import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    Timestamp,
    collection,
    runTransaction,
    arrayUnion,
    arrayRemove,
    onSnapshot,
    type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { FirebaseResult } from './types';

// ==================== Interfaces ====================

export interface QuestSelection {
    userId: string;
    teamName: string;
    userEmail: string;
    selectedAt: Timestamp;
}

export interface ProblemStatement {
    id?: string;
    title: string;
    description: string;
    maxTeams: number;       // Default 10
    selectedBy: QuestSelection[];
    createdAt: Timestamp;
    updatedAt?: Timestamp;
    isActive: boolean;
}

// ==================== CRUD Operations ====================

/**
 * Add a new problem statement
 */
export const addProblemStatement = async (
    title: string,
    description: string,
    maxTeams: number = 10
): Promise<FirebaseResult<string>> => {
    try {
        if (!db) throw new Error('Firestore is not initialized');

        const docRef = doc(collection(db, 'problemStatements'));
        const statement: ProblemStatement = {
            id: docRef.id,
            title,
            description,
            maxTeams,
            selectedBy: [],
            createdAt: Timestamp.now(),
            isActive: true,
        };

        await setDoc(docRef, statement);
        return { success: true, data: docRef.id };
    } catch (error: any) {
        console.error('Error adding problem statement:', error);
        return { success: false, error: error.message || 'Failed to add problem statement' };
    }
};

/**
 * Update a problem statement
 */
export const updateProblemStatement = async (
    statementId: string,
    data: Partial<Pick<ProblemStatement, 'title' | 'description' | 'maxTeams' | 'isActive'>>
): Promise<FirebaseResult<void>> => {
    try {
        if (!db) throw new Error('Firestore is not initialized');

        const docRef = doc(db, 'problemStatements', statementId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now(),
        });

        return { success: true };
    } catch (error: any) {
        console.error('Error updating problem statement:', error);
        return { success: false, error: error.message || 'Failed to update problem statement' };
    }
};

/**
 * Delete a problem statement AND clean up all associated lock docs.
 * Without this cleanup, users who selected the deleted quest would be
 * permanently locked out of quest selection (orphaned lock docs).
 */
export const deleteProblemStatement = async (
    statementId: string
): Promise<FirebaseResult<void>> => {
    try {
        if (!db) throw new Error('Firestore is not initialized');
        const firestore = db;

        await runTransaction(firestore, async (transaction) => {
            const statementRef = doc(firestore, 'problemStatements', statementId);
            const statementSnap = await transaction.get(statementRef);

            if (!statementSnap.exists()) {
                throw new Error('Problem statement not found');
            }

            const data = statementSnap.data() as ProblemStatement;

            // Delete all associated user lock docs so they can re-select
            if (data.selectedBy && data.selectedBy.length > 0) {
                for (const selection of data.selectedBy) {
                    const lockRef = doc(firestore, 'questSelections', selection.userId);
                    transaction.delete(lockRef);
                }
            }

            // Delete the problem statement itself
            transaction.delete(statementRef);
        });

        return { success: true };
    } catch (error: any) {
        console.error('Error deleting problem statement:', error);
        return { success: false, error: error.message || 'Failed to delete problem statement' };
    }
};

/**
 * Get all problem statements
 */
export const getAllProblemStatements = async (): Promise<FirebaseResult<ProblemStatement[]>> => {
    try {
        if (!db) throw new Error('Firestore is not initialized');

        const statementsRef = collection(db, 'problemStatements');
        const querySnapshot = await getDocs(statementsRef);

        const statements: ProblemStatement[] = [];
        querySnapshot.forEach((doc) => {
            statements.push({ id: doc.id, ...doc.data() } as ProblemStatement);
        });

        // Sort by creation time
        statements.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());

        return { success: true, data: statements };
    } catch (error: any) {
        console.error('Error getting problem statements:', error);
        return { success: false, error: error.message || 'Failed to get problem statements' };
    }
};

/**
 * Get a single problem statement by ID
 */
export const getProblemStatement = async (
    statementId: string
): Promise<FirebaseResult<ProblemStatement>> => {
    try {
        if (!db) throw new Error('Firestore is not initialized');

        const docRef = doc(db, 'problemStatements', statementId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return { success: false, error: 'Problem statement not found' };
        }

        return {
            success: true,
            data: { id: docSnap.id, ...docSnap.data() } as ProblemStatement,
        };
    } catch (error: any) {
        console.error('Error getting problem statement:', error);
        return { success: false, error: error.message || 'Failed to get problem statement' };
    }
};

// ==================== Selection Operations ====================

/**
 * Select a problem statement for a team.
 * 
 * RACE-CONDITION SAFE — uses a two-document transaction:
 *   1. questSelections/{userId} — enforces one-selection-per-user via Firestore's
 *      document uniqueness. If this doc already exists, the user already picked.
 *   2. problemStatements/{statementId} — read via transaction.get() so Firestore
 *      retries the transaction if another write lands between our read and write.
 * 
 * Both documents are read and written inside the SAME transaction, so either
 * both succeed or both fail — no partial state.
 */
export const selectProblemStatement = async (
    userId: string,
    teamName: string,
    userEmail: string,
    statementId: string
): Promise<FirebaseResult<void>> => {
    try {
        if (!db) throw new Error('Firestore is not initialized');
        const firestore = db;

        await runTransaction(firestore, async (transaction) => {
            // === READ PHASE (all reads MUST happen before any writes) ===

            // 1. Check if user already selected ANY quest (via dedicated lock doc)
            const userLockRef = doc(firestore, 'questSelections', userId);
            const userLockSnap = await transaction.get(userLockRef);

            if (userLockSnap.exists()) {
                throw new Error('You have already selected a quest! Each team can only pick one quest.');
            }

            // 2. Read the target problem statement (transaction-safe)
            const statementRef = doc(firestore, 'problemStatements', statementId);
            const statementSnap = await transaction.get(statementRef);

            if (!statementSnap.exists()) {
                throw new Error('Problem statement not found');
            }

            const statement = statementSnap.data() as ProblemStatement;

            if (!statement.isActive) {
                throw new Error('This quest is no longer available');
            }

            // 3. Check capacity
            const currentSelections = statement.selectedBy?.length || 0;
            if (currentSelections >= statement.maxTeams) {
                throw new Error('This quest has reached its maximum number of teams. Please choose another quest.');
            }

            // === WRITE PHASE (all writes happen after all reads) ===

            const selection: QuestSelection = {
                userId,
                teamName,
                userEmail,
                selectedAt: Timestamp.now(),
            };

            // 4a. Create the user's lock document (prevents double-selection)
            transaction.set(userLockRef, {
                userId,
                teamName,
                userEmail,
                statementId,
                selectedAt: Timestamp.now(),
            });

            // 4b. Add selection to the problem statement
            transaction.update(statementRef, {
                selectedBy: arrayUnion(selection),
                updatedAt: Timestamp.now(),
            });
        });

        return { success: true };
    } catch (error: any) {
        console.error('Error selecting problem statement:', error);
        return { success: false, error: error.message || 'Failed to select problem statement' };
    }
};

/**
 * Get the problem statement selected by a specific user.
 * First checks the fast questSelections/{userId} doc, then fetches the full statement.
 */
export const getUserQuestSelection = async (
    userId: string
): Promise<FirebaseResult<{ statement: ProblemStatement; selection: QuestSelection } | null>> => {
    try {
        if (!db) throw new Error('Firestore is not initialized');

        // Fast path: check the user's lock document
        const userLockRef = doc(db, 'questSelections', userId);
        const userLockSnap = await getDoc(userLockRef);

        if (!userLockSnap.exists()) {
            return { success: true, data: null };
        }

        const lockData = userLockSnap.data();
        const statementId = lockData.statementId;

        // Fetch the full problem statement
        const statementRef = doc(db, 'problemStatements', statementId);
        const statementSnap = await getDoc(statementRef);

        if (!statementSnap.exists()) {
            // Statement was deleted but lock exists — orphaned selection
            return { success: true, data: null };
        }

        const statement = { id: statementSnap.id, ...statementSnap.data() } as ProblemStatement;
        const userSelection = statement.selectedBy?.find(s => s.userId === userId);

        if (userSelection) {
            return {
                success: true,
                data: { statement, selection: userSelection },
            };
        }

        // Fallback: lock exists but user not in selectedBy (shouldn't happen)
        return { success: true, data: null };
    } catch (error: any) {
        console.error('Error getting user quest selection:', error);
        return { success: false, error: error.message || 'Failed to get user selection' };
    }
};

/**
 * Remove a user's selection from a problem statement (admin only).
 * Also deletes the user's lock document to allow re-selection.
 */
export const removeQuestSelection = async (
    statementId: string,
    userId: string
): Promise<FirebaseResult<void>> => {
    try {
        if (!db) throw new Error('Firestore is not initialized');
        const firestore = db;

        await runTransaction(firestore, async (transaction) => {
            // Read the statement
            const statementRef = doc(firestore, 'problemStatements', statementId);
            const statementSnap = await transaction.get(statementRef);

            if (!statementSnap.exists()) {
                throw new Error('Problem statement not found');
            }

            const data = statementSnap.data() as ProblemStatement;
            const selectionToRemove = data.selectedBy?.find(s => s.userId === userId);

            if (selectionToRemove) {
                transaction.update(statementRef, {
                    selectedBy: arrayRemove(selectionToRemove),
                    updatedAt: Timestamp.now(),
                });
            }

            // Remove the user's lock document
            const userLockRef = doc(firestore, 'questSelections', userId);
            transaction.delete(userLockRef);
        });

        return { success: true };
    } catch (error: any) {
        console.error('Error removing quest selection:', error);
        return { success: false, error: error.message || 'Failed to remove selection' };
    }
};

// ==================== Real-time Listener ====================

/**
 * Subscribe to real-time problem statement updates via onSnapshot.
 * Returns an unsubscribe function to clean up the listener.
 */
export const subscribeToProblemStatements = (
    onUpdate: (statements: ProblemStatement[]) => void,
    onError?: (error: Error) => void
): Unsubscribe => {
    if (!db) {
        onError?.(new Error('Firestore is not initialized'));
        return () => { };
    }

    const statementsRef = collection(db, 'problemStatements');

    return onSnapshot(
        statementsRef,
        (snapshot) => {
            const statements: ProblemStatement[] = [];
            snapshot.forEach((doc) => {
                statements.push({ id: doc.id, ...doc.data() } as ProblemStatement);
            });
            // Sort by creation time
            statements.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
            onUpdate(statements);
        },
        (error) => {
            console.error('onSnapshot error:', error);
            onError?.(error);
        }
    );
};
