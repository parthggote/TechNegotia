'use server';

import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_COOKIE_NAME = 'admin-session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;

// Warn if SESSION_SECRET is not set or is using default value
if (!SESSION_SECRET || SESSION_SECRET === 'your-secret-key-change-this-in-production') {
    console.warn('[WARNING] ADMIN_SESSION_SECRET is not set or using default value! Please set a strong secret in production.');
}

/**
 * Server-side admin login action
 * Validates credentials and sets secure HTTP-only cookie with HMAC signature
 */
export async function adminLogin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
        // Runtime validation
        if (!SESSION_SECRET || SESSION_SECRET === 'your-secret-key-change-this-in-production') {
            console.error('Admin login attempted with invalid SESSION_SECRET');
            return { success: false, error: 'Server configuration error - please contact administrator' };
        }

        // Validate credentials on server
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Create payload
            const payload = `${email}:${Date.now()}`;

            // Sign with HMAC
            const signature = createHmac('sha256', SESSION_SECRET)
                .update(payload)
                .digest('base64url');

            // Combine payload and signature
            const sessionToken = `${Buffer.from(payload).toString('base64url')}:${signature}`;

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
 * Validates the HMAC-signed session cookie
 */
export async function isAdminAuthenticated(): Promise<boolean> {
    try {
        // Runtime validation
        if (!SESSION_SECRET || SESSION_SECRET === 'your-secret-key-change-this-in-production') {
            console.warn('Admin authentication check with invalid SESSION_SECRET');
            return false;
        }

        const cookieStore = await cookies();
        const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

        if (!sessionToken) {
            return false;
        }

        // Parse token into payload and signature
        const parts = sessionToken.split(':');
        if (parts.length !== 2) {
            return false;
        }

        const [payloadB64, receivedSignature] = parts;

        // Decode payload
        const payload = Buffer.from(payloadB64, 'base64url').toString();

        // Recompute HMAC signature
        const expectedSignature = createHmac('sha256', SESSION_SECRET)
            .update(payload)
            .digest('base64url');

        // Constant-time comparison to prevent timing attacks
        const sigBuffer1 = Buffer.from(receivedSignature);
        const sigBuffer2 = Buffer.from(expectedSignature);

        if (sigBuffer1.length !== sigBuffer2.length) {
            return false;
        }

        if (!timingSafeEqual(sigBuffer1, sigBuffer2)) {
            return false;
        }

        // Parse and validate payload
        const [email, timestamp] = payload.split(':');

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
