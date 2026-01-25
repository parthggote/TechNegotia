"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal/AuthModal";
import styles from "./Header.module.css";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const { user, signOut } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleSignOut = async () => {
        await signOut();
        setShowUserMenu(false);
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/e6109e32a9ac1a8f2496d7fba78e9c84.gif"
                        alt="Mascot Logo"
                        width={60}
                        height={60}
                        className={styles.mascotLogo}
                        unoptimized
                    />
                    <span className={styles.logoText}>Tech Negotia</span>
                </Link>

                {/* Main Navigation - Desktop */}
                <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}>
                    {/* Mobile Close Button */}
                    <button
                        className={styles.mobileCloseBtn}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>

                    <ul className={styles.navList}>
                        {NAV_LINKS.map((link) => (
                            <li key={link.href} className={styles.navItem}>
                                <Link
                                    href={link.href}
                                    className={styles.navLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <i className={link.icon}></i>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Sign In Button - only show when not logged in */}
                    {!user ? (
                        <button
                            onClick={() => {
                                setIsAuthModalOpen(true);
                                setIsMobileMenuOpen(false);
                            }}
                            className={styles.mobileSignInBtn}
                        >
                            <i className="hn hn-user"></i>
                            Sign In / Sign Up
                        </button>
                    ) : (
                        <>
                            {/* Mobile Register Button - only show when logged in */}
                            <Link
                                href="/register"
                                className={styles.mobileRegisterBtn}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <i className="hn hn-sword"></i>
                                Register Now
                            </Link>

                            {/* Mobile Sign Out Button */}
                            <button
                                onClick={() => {
                                    handleSignOut();
                                    setIsMobileMenuOpen(false);
                                }}
                                className={styles.mobileSignOutBtn}
                            >
                                <i className="hn hn-logout"></i>
                                Sign Out
                            </button>

                            {/* Mobile User Info */}
                            <div className={styles.mobileUserInfo}>
                                <i className="hn hn-user"></i>
                                <span>{user.displayName || user.email?.split('@')[0]}</span>
                            </div>
                        </>
                    )}
                </nav>

                {/* Right Side Actions */}
                <div className={styles.actions}>
                    {/* Authentication Buttons - Desktop */}
                    {!user ? (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className={`nes-btn is-primary ${styles.authBtn}`}
                        >
                            Sign In / Sign Up
                        </button>
                    ) : (
                        <div className={styles.userMenu}>
                            <button
                                className={`nes-btn ${styles.userButton}`}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <i className="nes-icon user"></i>
                                {user.displayName || user.email?.split('@')[0]}
                            </button>

                            {showUserMenu && (
                                <div className={styles.userDropdown}>
                                    <div className="nes-container is-dark">
                                        <p style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                                            {user.email}
                                        </p>
                                        <button
                                            onClick={handleSignOut}
                                            className="nes-btn is-error"
                                            style={{ width: '100%', fontSize: '0.75rem' }}
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className={styles.mobileMenuBtn}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ""}`}></span>
                    </button>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Authentication Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </header>
    );
}
