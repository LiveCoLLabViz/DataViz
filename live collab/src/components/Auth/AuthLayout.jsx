import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/auth.css';

/**
 * AuthLayout — shared layout wrapper for SignIn and SignUp pages.
 * Includes the navbar (matching the landing site's sticky blurred nav),
 * responsive mobile menu, and a centered content area.
 */
export default function AuthLayout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', href: '/livecollab-site/index.html', external: true },
    { label: 'About', href: '/livecollab-site/about.html', external: true },
    { label: 'Contact', href: '/livecollab-site/contact.html', external: true },
  ];

  const LogoSVG = (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="authLogoGrad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#authLogoGrad)" />
      <path
        d="M7 22L11 15L16 18L21 10L25 12"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="15" r="2" fill="white" opacity="0.8" />
      <circle cx="16" cy="18" r="2" fill="white" opacity="0.8" />
      <circle cx="21" cy="10" r="2.5" fill="white" />
      <line x1="21" y1="10" x2="25" y2="12" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <circle cx="25" cy="12" r="1.5" fill="white" opacity="0.6" />
    </svg>
  );

  return (
    <div className="auth-layout">
      {/* Navbar */}
      <nav className={`auth-navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="auth-navbar-container">
          <a href="/livecollab-site/index.html" className="auth-nav-logo">
            {LogoSVG}
            <span>LiveCollab</span>
          </a>

          <div className="auth-nav-links">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="auth-nav-link"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="auth-nav-actions">
            <Link to="/signin" className="auth-btn auth-btn-text">
              Sign In
            </Link>
            <Link to="/signup" className="auth-btn auth-btn-outline">
              Sign Up
            </Link>
            <Link to="/signup" className="auth-btn auth-btn-gradient">
              Get Started
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="auth-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`auth-mobile-menu${mobileOpen ? ' open' : ''}`}>
        {navLinks.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
        <div className="auth-mobile-actions">
          <Link to="/signin" className="auth-btn auth-btn-text" style={{ width: '100%', textAlign: 'center' }}>
            Sign In
          </Link>
          <Link to="/signup" className="auth-btn auth-btn-outline" style={{ width: '100%', textAlign: 'center' }}>
            Sign Up
          </Link>
          <Link to="/signup" className="auth-btn auth-btn-gradient" style={{ width: '100%', textAlign: 'center' }}>
            Get Started
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="auth-content">
        {children}
      </div>
    </div>
  );
}
