"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/Toast";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Authentication modal component for sign in/sign up
 * Features themed design matching TechNegotia aesthetic
 */
export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, signIn, signInWithGoogle } = useAuth();
  const { showSuccess, showError } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = await signUp(email, password, displayName);
        if (result.success) {
          showSuccess("Welcome, adventurer! Account created successfully.");
          onClose();
        } else {
          setError(result.error || "Sign up failed");
          showError(result.error || "Sign up failed");
        }
      } else {
        const result = await signIn(email, password);
        if (result.success) {
          showSuccess("Welcome back, adventurer!");
          onClose();
        } else {
          setError(result.error || "Sign in failed");
          showError(result.error || "Sign in failed");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      showError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        showSuccess("Welcome, adventurer!");
        onClose();
      } else {
        setError(result.error || "Google sign in failed");
        showError(result.error || "Google sign in failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      showError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setEmail("");
    setPassword("");
    setDisplayName("");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <i className="hn hn-close"></i>
        </button>

        {/* Header with Icon */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <i className={isSignUp ? "hn hn-sword" : "hn hn-castle"}></i>
          </div>
          <h2 className={styles.title}>
            {isSignUp ? "Join the Quest" : "Welcome Back"}
          </h2>
          <p className={styles.subtitle}>
            {isSignUp ? "Create your adventurer account" : "Sign in to continue your journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {isSignUp && (
            <div className={styles.inputGroup}>
              <label htmlFor="displayName" className={styles.label}>
                <i className="hn hn-user"></i>
                Adventurer Name
              </label>
              <input
                type="text"
                id="displayName"
                className={styles.input}
                placeholder="Enter your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required={isSignUp}
                disabled={isLoading}
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              <i className="hn hn-email"></i>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="adventurer@quest.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              <i className="hn hn-lock"></i>
              Password
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
            {isSignUp && (
              <span className={styles.hint}>Minimum 6 characters</span>
            )}
          </div>

          {error && (
            <div className={styles.error}>
              <i className={`hn hn-warning ${styles.errorIcon}`}></i>
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Processing...
              </>
            ) : (
              <>
                <i className={isSignUp ? "hn hn-play" : "hn hn-arrow-right"}></i>
                {isSignUp ? "Create Account" : "Sign In"}
              </>
            )}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or continue with</span>
        </div>

        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg viewBox="0 0 24 24" className={styles.googleIcon}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <div className={styles.toggle}>
          <p>
            {isSignUp ? "Already have an account?" : "New adventurer?"}{" "}
            <button
              type="button"
              className={styles.toggleButton}
              onClick={toggleMode}
              disabled={isLoading}
            >
              {isSignUp ? "Sign In" : "Join Now"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
