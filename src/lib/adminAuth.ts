'use server';

import { cookies } from 'next/headers';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_COOKIE_NAME = 'admin-session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'default-secret-change-in-production';

/**
 * Server-side admin login action
 * Validates credentials and sets secure HTTP-only cookie
 */
export async function adminLogin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
        // Validate credentials on server
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Create session token (in production, use proper JWT or session management)
            const sessionToken = Buffer.from(`${email}:${Date.now()}:${SESSION_SECRET}`).toString('base64');

            // Set HTTP-only cookie
            const cookieStore = await cookies();
            cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            return { success: true };
        }

        return { success: false, error: 'Invalid credentials' };
    } catch (error) {
        console.error('Admin login error:', error);
        return { success: false, error: 'Login failed' };
    }
}

/**
 * Server-side admin logout action
 * Clears the session cookie
 */
export async function adminLogout(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Server-side check if user is authenticated as admin
 * Validates the session cookie
 */
export async function isAdminAuthenticated(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

        if (!sessionToken) {
            return false;
        }

        // Validate session token
        const decoded = Buffer.from(sessionToken, 'base64').toString();
        const [email, timestamp] = decoded.split(':');

        // Check if session is valid
        if (email === ADMIN_EMAIL) {
            const sessionAge = Date.now() - parseInt(timestamp);
            const maxAge = 60 * 60 * 24 * 1000; // 24 hours in ms

            if (sessionAge < maxAge) {
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('Admin auth check error:', error);
        return false;
    }
}
