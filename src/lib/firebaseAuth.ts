// Firebase Authentication helper functions
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    User as FirebaseUser,
    UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';
import { FirebaseResult } from './types';

/**
 * Sign up a new user with email and password
 */
export const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string
): Promise<FirebaseResult<FirebaseUser>> => {
    try {
        if (!auth) {
            throw new Error('Firebase Auth is not initialized');
        }

        const userCredential: UserCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Update display name if provided
        if (displayName && userCredential.user) {
            await updateProfile(userCredential.user, { displayName });
        }

        return {
            success: true,
            data: userCredential.user,
        };
    } catch (error: any) {
        console.error('Error signing up:', error);
        return {
            success: false,
            error: error.message || 'Failed to sign up',
        };
    }
};

/**
 * Sign in an existing user with email and password
 */
export const signInWithEmail = async (
    email: string,
    password: string
): Promise<FirebaseResult<FirebaseUser>> => {
    try {
        if (!auth) {
            throw new Error('Firebase Auth is not initialized');
        }

        const userCredential: UserCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        return {
            success: true,
            data: userCredential.user,
        };
    } catch (error: any) {
        console.error('Error signing in:', error);
        return {
            success: false,
            error: error.message || 'Failed to sign in',
        };
    }
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async (): Promise<FirebaseResult<FirebaseUser>> => {
    try {
        if (!auth) {
            throw new Error('Firebase Auth is not initialized');
        }

        const provider = new GoogleAuthProvider();
        const userCredential: UserCredential = await signInWithPopup(auth, provider);

        return {
            success: true,
            data: userCredential.user,
        };
    } catch (error: any) {
        console.error('Error signing in with Google:', error);
        return {
            success: false,
            error: error.message || 'Failed to sign in with Google',
        };
    }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<FirebaseResult<void>> => {
    try {
        if (!auth) {
            throw new Error('Firebase Auth is not initialized');
        }

        await firebaseSignOut(auth);

        return {
            success: true,
        };
    } catch (error: any) {
        console.error('Error signing out:', error);
        return {
            success: false,
            error: error.message || 'Failed to sign out',
        };
    }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<FirebaseResult<void>> => {
    try {
        if (!auth) {
            throw new Error('Firebase Auth is not initialized');
        }

        await sendPasswordResetEmail(auth, email);

        return {
            success: true,
        };
    } catch (error: any) {
        console.error('Error sending password reset email:', error);
        return {
            success: false,
            error: error.message || 'Failed to send password reset email',
        };
    }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = (): FirebaseUser | null => {
    if (!auth) {
        console.error('Firebase Auth is not initialized');
        return null;
    }

    return auth.currentUser;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
    displayName?: string,
    photoURL?: string
): Promise<FirebaseResult<void>> => {
    try {
        if (!auth || !auth.currentUser) {
            throw new Error('No user is currently signed in');
        }

        await updateProfile(auth.currentUser, {
            displayName: displayName || auth.currentUser.displayName,
            photoURL: photoURL || auth.currentUser.photoURL,
        });

        return {
            success: true,
        };
    } catch (error: any) {
        console.error('Error updating profile:', error);
        return {
            success: false,
            error: error.message || 'Failed to update profile',
        };
    }
};
