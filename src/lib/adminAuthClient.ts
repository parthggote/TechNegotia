/**
 * Client-side admin session helpers
 * These run in the browser and manage UI state only
 */

const SESSION_COOKIE_NAME = 'admin-session';

/**
 * Client-side helper to check if admin session exists
 * This only checks for cookie presence, actual validation is server-side
 */
export function checkAdminSession(): boolean {
    if (typeof window === 'undefined') return false;

    // Check if session cookie exists (client can only check presence, not validate)
    return document.cookie.includes(SESSION_COOKIE_NAME);
}

/**
 * Client-side helper to set session indicator in localStorage
 * Used for UI state only, not for actual authentication
 */
export function setAdminSession(): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('admin-logged-in', 'true');
    }
}

/**
 * Client-side helper to clear session indicator
 */
export function clearAdminSession(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('admin-logged-in');
    }
}
