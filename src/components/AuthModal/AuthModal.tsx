"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, signIn, signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = await signUp(email, password, displayName);
        if (result.success) {
          onClose();
        } else {
          setError(result.error || "Sign up failed");
        }
      } else {
        const result = await signIn(email, password);
        if (result.success) {
          onClose();
        } else {
          setError(result.error || "Sign in failed");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
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
        onClose();
      } else {
        setError(result.error || "Google sign in failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
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
        <div className="nes-container is-dark with-title">
          <p className="title">{isSignUp ? "Join the Quest" : "Welcome Back, Adventurer"}</p>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            {isSignUp && (
              <div className="nes-field" style={{ marginBottom: "1rem" }}>
                <label htmlFor="displayName">Adventurer Name</label>
                <input
                  type="text"
                  id="displayName"
                  className="nes-input is-dark"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={isSignUp}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="nes-field" style={{ marginBottom: "1rem" }}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="nes-input is-dark"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="nes-field" style={{ marginBottom: "1rem" }}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="nes-input is-dark"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className={styles.error}>
                <p className="nes-text is-error">{error}</p>
              </div>
            )}

            <div className={styles.buttons}>
              <button
                type="submit"
                className="nes-btn is-primary"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
              </button>

              <button
                type="button"
                className="nes-btn"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <button
            type="button"
            className="nes-btn is-error"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{ width: "100%" }}
          >
            <i className="nes-icon google"></i> Sign in with Google
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
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
