"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import styles from './Toast.module.css';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showWarning: (message: string) => void;
    showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Hook to access toast notification functions
 * @returns Toast context with show methods
 */
export function useToast(): ToastContextType {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

interface ToastProviderProps {
    children: ReactNode;
}

/**
 * Provider component for toast notifications
 * Wrap your app with this to enable toast functionality
 */
export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast: Toast = { id, message, type };

        setToasts(prev => [...prev, newToast]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, [removeToast]);

    const showSuccess = useCallback((message: string) => showToast(message, 'success'), [showToast]);
    const showError = useCallback((message: string) => showToast(message, 'error'), [showToast]);
    const showWarning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);
    const showInfo = useCallback((message: string) => showToast(message, 'info'), [showToast]);

    const getIconClass = (type: ToastType): string => {
        switch (type) {
            case 'success': return 'hn hn-check';
            case 'error': return 'hn hn-close';
            case 'warning': return 'hn hn-warning';
            case 'info': return 'hn hn-info';
            default: return 'hn hn-info';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`${styles.toast} ${styles[toast.type]}`}
                        onClick={() => removeToast(toast.id)}
                    >
                        <i className={`${getIconClass(toast.type)} ${styles.icon}`}></i>
                        <span className={styles.message}>{toast.message}</span>
                        <button className={styles.closeBtn} onClick={() => removeToast(toast.id)}>
                            <i className="hn hn-close"></i>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export default ToastProvider;
