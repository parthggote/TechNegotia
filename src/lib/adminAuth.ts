// Admin authentication helper
export const isAdmin = (email: string, password: string): boolean => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    return email === adminEmail && password === adminPassword;
};

// Check if current session is admin (stored in sessionStorage)
export const checkAdminSession = (): boolean => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('isAdmin') === 'true';
};

// Set admin session
export const setAdminSession = (): void => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('isAdmin', 'true');
    }
};

// Clear admin session
export const clearAdminSession = (): void => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('isAdmin');
    }
};
