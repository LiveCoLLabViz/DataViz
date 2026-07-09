import React from 'react';

/**
 * AuthCard — the centered white card that wraps sign-in / sign-up forms.
 * Matches the landing site's card styling: 24px radius, soft shadow, white bg.
 */
export default function AuthCard({ title, subtitle, children }) {
  const LogoSVG = (
    <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="cardLogoGrad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#cardLogoGrad)" />
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
      <circle cx="25" cy="12" r="1.5" fill="white" opacity="0.6" />
    </svg>
  );

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <div className="auth-card-logo">
          {LogoSVG}
          <span>LiveCollab</span>
        </div>
        <h1 className="auth-card-title">{title}</h1>
        {subtitle && <p className="auth-card-subtitle">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
