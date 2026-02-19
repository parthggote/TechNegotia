'use client';

// Custom React hook for Firebase Authentication
import { useEffect, useState, useRef, useCallback } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    signUpWithEmail as firebaseSignUp,
    signInWithEmail as firebaseSignIn,
    signInWithGoogle as firebaseGoogleSignIn,
    signOut as firebaseSignOut,
    resetPassword as firebaseResetPassword,
    updateUserProfile as firebaseUpdateProfile,
} from '@/lib/firebaseAuth';
import { FirebaseResult } from '@/lib/types';

interface UseAuthReturn {
    user: FirebaseUser | null;
    loading: boolean;
    error: string | null;
    signUp: (email: string, password: string, displayName?: string) => Promise<FirebaseResult<FirebaseUser>>;
    signIn: (email: string, password: string) => Promise<FirebaseResult<FirebaseUser>>;
    signInWithGoogle: () => Promise<FirebaseResult<FirebaseUser>>;
    signOut: () => Promise<FirebaseResult<void>>;
    resetPassword: (email: string) => Promise<FirebaseResult<void>>;
    updateProfile: (displayName?: string, photoURL?: string) => Promise<FirebaseResult<void>>;
}

/**
 * Custom hook for Firebase Authentication
 * Provides auth state and helper functions.
 *
 * Uses a ref to track in-progress operations so that onAuthStateChanged
 * doesn't prematurely clear the loading state while an operation is running.
 */
export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Tracks whether an auth operation (signUp/signIn/signOut etc.) is in progress.
    // Prevents onAuthStateChanged from setting loading=false mid-operation.
    const operationInProgress = useRef(false);

    useEffect(() => {
        if (!auth) {
            setError('Firebase Auth is not initialized. Please check your configuration.');
            setLoading(false);
            return;
        }

        // Subscribe to auth state changes
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                setUser(user);
                // Only clear loading if no manual operation is running
                if (!operationInProgress.current) {
                    setLoading(false);
                }
                setError(null);
            },
            (error) => {
                console.error('Auth state change error:', error);
                setError(error.message);
                setLoading(false);
            }
        );

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    /**
     * Wraps an async auth operation with loading/error state management.
     * Sets the ref so onAuthStateChanged doesn't prematurely clear loading.
     */
    const withOperation = useCallback(async <T>(
        fn: () => Promise<FirebaseResult<T>>,
        errorLabel: string
    ): Promise<FirebaseResult<T>> => {
        operationInProgress.current = true;
        setLoading(true);
        setError(null);

        const result = await fn();

        if (!result.success) {
            setError(result.error || errorLabel);
        }

        operationInProgress.current = false;
        setLoading(false);
        return result;
    }, []);

    const signUp = useCallback(async (
        email: string,
        password: string,
        displayName?: string
    ): Promise<FirebaseResult<FirebaseUser>> => {
        return withOperation(() => firebaseSignUp(email, password, displayName), 'Sign up failed');
    }, [withOperation]);

    const signIn = useCallback(async (
        email: string,
        password: string
    ): Promise<FirebaseResult<FirebaseUser>> => {
        return withOperation(() => firebaseSignIn(email, password), 'Sign in failed');
    }, [withOperation]);

    const signInWithGoogle = useCallback(async (): Promise<FirebaseResult<FirebaseUser>> => {
        return withOperation(() => firebaseGoogleSignIn(), 'Google sign in failed');
    }, [withOperation]);

    const signOut = useCallback(async (): Promise<FirebaseResult<void>> => {
        return withOperation(() => firebaseSignOut(), 'Sign out failed');
    }, [withOperation]);

    const resetPassword = useCallback(async (email: string): Promise<FirebaseResult<void>> => {
        return withOperation(() => firebaseResetPassword(email), 'Password reset failed');
    }, [withOperation]);

    const updateProfile = useCallback(async (
        displayName?: string,
        photoURL?: string
    ): Promise<FirebaseResult<void>> => {
        return withOperation(
            () => firebaseUpdateProfile(displayName, photoURL),
            'Profile update failed'
        );
    }, [withOperation]);

    return {
        user,
        loading,
        error,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updateProfile,
    };
};
