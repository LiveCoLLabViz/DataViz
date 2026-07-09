import React from 'react';

/**
 * AuthButton — primary gradient submit button for auth forms.
 * Uses the same indigo→purple gradient as the landing site's primary CTA buttons.
 */
export default function AuthButton({ children, loading = false, disabled = false, type = 'submit', onClick }) {
  return (
    <button
      type={type}
      className="auth-btn auth-btn-primary"
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <span className="auth-spinner" />
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
