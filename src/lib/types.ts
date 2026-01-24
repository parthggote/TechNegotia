// TypeScript types for Firebase data structures

// User profile data
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// NOTE: Registration and TeamMember interfaces are defined in @/lib/registrationService.ts
// Import from there to use the canonical definitions with Firestore Timestamp types


// Contact form submission data
export interface ContactSubmission {
    id?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'responded';
    createdAt: Date;
    respondedAt?: Date;
}

// Schedule/Event data
export interface Event {
    id?: string;
    title: string;
    description: string;
    date: Date;
    time: string;
    venue: string;
    type: 'workshop' | 'competition' | 'ceremony' | 'other';
    maxParticipants?: number;
    currentParticipants?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

// Prize data
export interface Prize {
    id?: string;
    eventName: string;
    position: number;
    amount: number;
    description: string;
    winners?: string[];
}

// Firestore query filter
export interface QueryFilter {
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'array-contains-any';
    value: any;
}

// Firestore query options
export interface QueryOptions {
    filters?: QueryFilter[];
    orderBy?: {
        field: string;
        direction: 'asc' | 'desc';
    };
    limit?: number;
}

// Firebase operation result
export interface FirebaseResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}
