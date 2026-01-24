'use client';

// Custom React hook for Firestore operations
import { useState, useEffect } from 'react';
import { DocumentData, Unsubscribe } from 'firebase/firestore';
import {
    addDocument as firestoreAdd,
    getDocument as firestoreGet,
    updateDocument as firestoreUpdate,
    deleteDocument as firestoreDelete,
    queryDocuments as firestoreQuery,
    getAllDocuments as firestoreGetAll,
    subscribeToCollection,
    subscribeToDocument,
} from '@/lib/firebaseFirestore';
import { FirebaseResult, QueryOptions } from '@/lib/types';

interface UseFirestoreReturn<T extends DocumentData> {
    data: T | T[] | null;
    loading: boolean;
    error: string | null;
    addDocument: (collectionName: string, data: T) => Promise<FirebaseResult<string>>;
    getDocument: (collectionName: string, documentId: string) => Promise<FirebaseResult<T>>;
    updateDocument: (collectionName: string, documentId: string, data: Partial<T>) => Promise<FirebaseResult<void>>;
    deleteDocument: (collectionName: string, documentId: string) => Promise<FirebaseResult<void>>;
    queryDocuments: (collectionName: string, options?: QueryOptions) => Promise<FirebaseResult<T[]>>;
    getAllDocuments: (collectionName: string) => Promise<FirebaseResult<T[]>>;
}

/**
 * Custom hook for Firestore operations
 * Provides CRUD operations with loading and error states
 */
export const useFirestore = <T extends DocumentData>(): UseFirestoreReturn<T> => {
    const [data, setData] = useState<T | T[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addDocument = async (
        collectionName: string,
        documentData: T
    ): Promise<FirebaseResult<string>> => {
        setLoading(true);
        setError(null);
        const result = await firestoreAdd<T>(collectionName, documentData);
        if (!result.success) {
            setError(result.error || 'Failed to add document');
        }
        setLoading(false);
        return result;
    };

    const getDocument = async (
        collectionName: string,
        documentId: string
    ): Promise<FirebaseResult<T>> => {
        setLoading(true);
        setError(null);
        const result = await firestoreGet<T>(collectionName, documentId);
        if (result.success && result.data) {
            setData(result.data);
        } else {
            setError(result.error || 'Failed to get document');
        }
        setLoading(false);
        return result;
    };

    const updateDocument = async (
        collectionName: string,
        documentId: string,
        documentData: Partial<T>
    ): Promise<FirebaseResult<void>> => {
        setLoading(true);
        setError(null);
        const result = await firestoreUpdate<T>(collectionName, documentId, documentData);
        if (!result.success) {
            setError(result.error || 'Failed to update document');
        }
        setLoading(false);
        return result;
    };

    const deleteDocument = async (
        collectionName: string,
        documentId: string
    ): Promise<FirebaseResult<void>> => {
        setLoading(true);
        setError(null);
        const result = await firestoreDelete(collectionName, documentId);
        if (!result.success) {
            setError(result.error || 'Failed to delete document');
        }
        setLoading(false);
        return result;
    };

    const queryDocuments = async (
        collectionName: string,
        options?: QueryOptions
    ): Promise<FirebaseResult<T[]>> => {
        setLoading(true);
        setError(null);
        const result = await firestoreQuery<T>(collectionName, options);
        if (result.success && result.data) {
            setData(result.data);
        } else {
            setError(result.error || 'Failed to query documents');
        }
        setLoading(false);
        return result;
    };

    const getAllDocuments = async (
        collectionName: string
    ): Promise<FirebaseResult<T[]>> => {
        setLoading(true);
        setError(null);
        const result = await firestoreGetAll<T>(collectionName);
        if (result.success && result.data) {
            setData(result.data);
        } else {
            setError(result.error || 'Failed to get documents');
        }
        setLoading(false);
        return result;
    };

    return {
        data,
        loading,
        error,
        addDocument,
        getDocument,
        updateDocument,
        deleteDocument,
        queryDocuments,
        getAllDocuments,
    };
};

/**
 * Custom hook for real-time collection subscription
 */
export const useCollection = <T extends DocumentData>(
    collectionName: string,
    options?: QueryOptions
) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const unsubscribe: Unsubscribe | null = subscribeToCollection<T>(
            collectionName,
            (documents) => {
                setData(documents);
                setLoading(false);
            },
            options
        );

        if (!unsubscribe) {
            setError('Failed to subscribe to collection');
            setLoading(false);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [collectionName, options]);

    return { data, loading, error };
};

/**
 * Custom hook for real-time document subscription
 */
export const useDocument = <T extends DocumentData>(
    collectionName: string,
    documentId: string
) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const unsubscribe: Unsubscribe | null = subscribeToDocument<T>(
            collectionName,
            documentId,
            (document) => {
                setData(document);
                setLoading(false);
            }
        );

        if (!unsubscribe) {
            setError('Failed to subscribe to document');
            setLoading(false);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [collectionName, documentId]);

    return { data, loading, error };
};
