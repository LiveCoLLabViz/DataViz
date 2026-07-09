import React from 'react';

/**
 * Divider — horizontal line with centered "OR" text.
 * Separates the primary auth button from the Google auth button.
 */
export default function Divider({ text = 'OR' }) {
  return (
    <div className="auth-divider">
      <div className="auth-divider-line" />
      <span className="auth-divider-text">{text}</span>
      <div className="auth-divider-line" />
    </div>
  );
}
