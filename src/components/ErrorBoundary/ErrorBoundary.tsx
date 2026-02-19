'use client';

import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * React Error Boundary — catches render errors and shows a fallback UI
 * instead of a white screen crash. Wrap around page content or the entire app.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0a0e1f',
                    color: '#e0e0ff',
                    fontFamily: 'monospace',
                    padding: '2rem',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <h1 style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '1.2rem',
                        marginBottom: '1rem',
                        color: '#ff6b6b',
                    }}>
                        SYSTEM ERROR
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.6)',
                        maxWidth: '400px',
                        lineHeight: 1.6,
                        marginBottom: '2rem',
                    }}>
                        Something went wrong. The quest board encountered an unexpected error.
                        Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            window.location.reload();
                        }}
                        style={{
                            padding: '0.75rem 2rem',
                            background: 'linear-gradient(135deg, #4a6cf7, #6366f1)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                        }}
                    >
                        🔄 Reload Page
                    </button>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <pre style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            background: 'rgba(255,0,0,0.1)',
                            border: '1px solid rgba(255,0,0,0.2)',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            maxWidth: '600px',
                            overflow: 'auto',
                            textAlign: 'left',
                            color: '#ff8888',
                        }}>
                            {this.state.error.message}
                            {'\n'}
                            {this.state.error.stack}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
