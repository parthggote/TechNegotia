// Firestore database helper functions
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    Timestamp,
    QueryConstraint,
    DocumentData,
    WhereFilterOp,
    OrderByDirection,
    Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { FirebaseResult, QueryFilter, QueryOptions } from './types';

/**
 * Add a new document to a collection
 */
export const addDocument = async <T extends DocumentData>(
    collectionName: string,
    data: T
): Promise<FirebaseResult<string>> => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        // Add timestamp
        const docData = {
            ...data,
            createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, collectionName), docData);

        return {
            success: true,
            data: docRef.id,
        };
    } catch (error: any) {
        console.error('Error adding document:', error);
        return {
            success: false,
            error: error.message || 'Failed to add document',
        };
    }
};

/**
 * Get a single document by ID
 */
export const getDocument = async <T extends DocumentData>(
    collectionName: string,
    documentId: string
): Promise<FirebaseResult<T>> => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return {
                success: false,
                error: 'Document not found',
            };
        }

        const data = {
            id: docSnap.id,
            ...docSnap.data(),
        } as T & { id: string };

        return {
            success: true,
            data,
        };
    } catch (error: any) {
        console.error('Error getting document:', error);
        return {
            success: false,
            error: error.message || 'Failed to get document',
        };
    }
};

/**
 * Update an existing document
 */
export const updateDocument = async <T extends DocumentData>(
    collectionName: string,
    documentId: string,
    data: Partial<T>
): Promise<FirebaseResult<void>> => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const docRef = doc(db, collectionName, documentId);

        // Add update timestamp
        const updateData = {
            ...data,
            updatedAt: Timestamp.now(),
        };

        await updateDoc(docRef, updateData);

        return {
            success: true,
        };
    } catch (error: any) {
        console.error('Error updating document:', error);
        return {
            success: false,
            error: error.message || 'Failed to update document',
        };
    }
};

/**
 * Delete a document
 */
export const deleteDocument = async (
    collectionName: string,
    documentId: string
): Promise<FirebaseResult<void>> => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const docRef = doc(db, collectionName, documentId);
        await deleteDoc(docRef);

        return {
            success: true,
        };
    } catch (error: any) {
        console.error('Error deleting document:', error);
        return {
            success: false,
            error: error.message || 'Failed to delete document',
        };
    }
};

/**
 * Query documents with filters
 */
export const queryDocuments = async <T extends DocumentData>(
    collectionName: string,
    options?: QueryOptions
): Promise<FirebaseResult<T[]>> => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const collectionRef = collection(db, collectionName);
        const constraints: QueryConstraint[] = [];

        // Add filters
        if (options?.filters) {
            options.filters.forEach((filter: QueryFilter) => {
                constraints.push(
                    where(filter.field, filter.operator as WhereFilterOp, filter.value)
                );
            });
        }

        // Add ordering
        if (options?.orderBy) {
            constraints.push(
                orderBy(options.orderBy.field, options.orderBy.direction as OrderByDirection)
            );
        }

        // Add limit
        if (options?.limit) {
            constraints.push(limit(options.limit));
        }

        const q = query(collectionRef, ...constraints);
        const querySnapshot = await getDocs(q);

        const documents: T[] = [];
        querySnapshot.forEach((doc) => {
            documents.push({
                id: doc.id,
                ...doc.data(),
            } as T & { id: string });
        });

        return {
            success: true,
            data: documents,
        };
    } catch (error: any) {
        console.error('Error querying documents:', error);
        return {
            success: false,
            error: error.message || 'Failed to query documents',
        };
    }
};

/**
 * Get all documents from a collection
 */
export const getAllDocuments = async <T extends DocumentData>(
    collectionName: string
): Promise<FirebaseResult<T[]>> => {
    return queryDocuments<T>(collectionName);
};

/**
 * Subscribe to real-time updates for a collection
 */
export const subscribeToCollection = <T extends DocumentData>(
    collectionName: string,
    callback: (documents: T[]) => void,
    options?: QueryOptions
): Unsubscribe | null => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const collectionRef = collection(db, collectionName);
        const constraints: QueryConstraint[] = [];

        // Add filters
        if (options?.filters) {
            options.filters.forEach((filter: QueryFilter) => {
                constraints.push(
                    where(filter.field, filter.operator as WhereFilterOp, filter.value)
                );
            });
        }

        // Add ordering
        if (options?.orderBy) {
            constraints.push(
                orderBy(options.orderBy.field, options.orderBy.direction as OrderByDirection)
            );
        }

        // Add limit
        if (options?.limit) {
            constraints.push(limit(options.limit));
        }

        const q = query(collectionRef, ...constraints);

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const documents: T[] = [];
                querySnapshot.forEach((doc) => {
                    documents.push({
                        id: doc.id,
                        ...doc.data(),
                    } as T & { id: string });
                });
                callback(documents);
            },
            (error) => {
                console.error('Error in collection snapshot listener:', error);
                callback([]); // Return empty array on error
            }
        );

        return unsubscribe;
    } catch (error: any) {
        console.error('Error subscribing to collection:', error);
        return null;
    }
};

/**
 * Subscribe to real-time updates for a single document
 */
export const subscribeToDocument = <T extends DocumentData>(
    collectionName: string,
    documentId: string,
    callback: (document: T | null) => void
): Unsubscribe | null => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const docRef = doc(db, collectionName, documentId);

        const unsubscribe = onSnapshot(
            docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    callback({
                        id: docSnap.id,
                        ...docSnap.data(),
                    } as T & { id: string });
                } else {
                    callback(null);
                }
            },
            (error) => {
                console.error('Error in document snapshot listener:', error);
                callback(null); // Signal failure by passing null
            }
        );

        return unsubscribe;
    } catch (error: any) {
        console.error('Error subscribing to document:', error);
        return null;
    }
};
