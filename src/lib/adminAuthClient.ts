/**
 * Client-side admin session helpers
 * These run in the browser and manage UI state only
 */

/**
 * Client-side helper to check if admin session exists
 * Reads from localStorage since the actual session cookie is httpOnly and not accessible
 */
export function checkAdminSession(): boolean {
    if (typeof window === 'undefined') return false;

    // Check localStorage flag set by setAdminSession after successful login
    return localStorage.getItem('admin-logged-in') === 'true';
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
