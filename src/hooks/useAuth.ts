'use client';

// Custom React hook for Firebase Authentication
import { useEffect, useState } from 'react';
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
 * Provides auth state and helper functions
 */
export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                setLoading(false);
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

    const signUp = async (
        email: string,
        password: string,
        displayName?: string
    ): Promise<FirebaseResult<FirebaseUser>> => {
        setLoading(true);
        setError(null);
        const result = await firebaseSignUp(email, password, displayName);
        if (!result.success) {
            setError(result.error || 'Sign up failed');
        }
        setLoading(false);
        return result;
    };

    const signIn = async (
        email: string,
        password: string
    ): Promise<FirebaseResult<FirebaseUser>> => {
        setLoading(true);
        setError(null);
        const result = await firebaseSignIn(email, password);
        if (!result.success) {
            setError(result.error || 'Sign in failed');
        }
        setLoading(false);
        return result;
    };

    const signInWithGoogle = async (): Promise<FirebaseResult<FirebaseUser>> => {
        setLoading(true);
        setError(null);
        const result = await firebaseGoogleSignIn();
        if (!result.success) {
            setError(result.error || 'Google sign in failed');
        }
        setLoading(false);
        return result;
    };

    const signOut = async (): Promise<FirebaseResult<void>> => {
        setLoading(true);
        setError(null);
        const result = await firebaseSignOut();
        if (!result.success) {
            setError(result.error || 'Sign out failed');
        }
        setLoading(false);
        return result;
    };

    const resetPassword = async (email: string): Promise<FirebaseResult<void>> => {
        setLoading(true);
        setError(null);
        const result = await firebaseResetPassword(email);
        if (!result.success) {
            setError(result.error || 'Password reset failed');
        }
        setLoading(false);
        return result;
    };

    const updateProfile = async (
        displayName?: string,
        photoURL?: string
    ): Promise<FirebaseResult<void>> => {
        setLoading(true);
        setError(null);
        const result = await firebaseUpdateProfile(displayName, photoURL);
        if (!result.success) {
            setError(result.error || 'Profile update failed');
        }
        setLoading(false);
        return result;
    };

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
