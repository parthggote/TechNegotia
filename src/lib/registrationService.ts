// Registration service for Firestore operations
import { doc, setDoc, getDoc, Timestamp, collection, getDocs, updateDoc } from 'firebase/firestore';
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
    timestamp: Timestamp;
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
 * Uses user ID as document ID to prevent duplicates
 */
export const saveRegistration = async (
    userId: string,
    userEmail: string,
    teamName: string,
    members: TeamMember[],
    paymentProofURL: string
): Promise<FirebaseResult<void>> => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const registration: Registration = {
            userId,
            userEmail,
            teamName,
            members,
            paymentProofURL,
            timestamp: Timestamp.now(),
            status: 'pending',
        };

        // Use setDoc with user ID as document ID
        // This ensures one registration per user
        const docRef = doc(db, 'registrations', userId);
        await setDoc(docRef, registration);

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

/**
 * Update registration status (admin only)
 */
export const updateRegistrationStatus = async (
    userId: string,
    status: 'pending' | 'approved' | 'rejected'
): Promise<FirebaseResult<void>> => {
    try {
        if (!db) {
            throw new Error('Firestore is not initialized');
        }

        const docRef = doc(db, 'registrations', userId);
        await updateDoc(docRef, {
            status,
            updatedAt: Timestamp.now(),
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
