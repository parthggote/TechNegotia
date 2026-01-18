"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import styles from "./Header.module.css";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>TN</span>
                    <span className={styles.logoText}>TechNegotia</span>
                </Link>

                {/* Main Navigation - Desktop */}
                <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}>
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

                    {/* Mobile Register Button */}
                    <Link
                        href="/register"
                        className={styles.mobileRegisterBtn}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Register Now
                    </Link>
                </nav>

                {/* Right Side Actions */}
                <div className={styles.actions}>
                    {/* Register Button - Desktop */}
                    <Link href="/register" className="nes-btn is-primary">
                        Sign up
                    </Link>

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
        </header>
    );
}
