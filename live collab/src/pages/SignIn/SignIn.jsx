import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import {
  AuthLayout,
  AuthCard,
  AuthInput,
  AuthButton,
  GoogleAuthButton,
  Divider,
} from '../../components/Auth';

/**
 * SignIn page — frontend-only sign-in form.
 * No backend, no auth provider — placeholder handlers only.
 */
export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // If the user is already authenticated, redirect them directly to the workspace
    if (isAuthenticated || localStorage.getItem('token')) {
      navigate('/workspace', { replace: true });
      return;
    }

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Force a full reload to reinitialize Redux state with the new token
      window.location.href = '/workspace';
    }
  }, [location, isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ email: form.email, password: form.password }));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/workspace'); // or wherever the landing is after login
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to your LiveCollab account to continue collaborating."
      >
        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthInput
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
          />

          <AuthInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
          />

          <Link to="#" className="auth-forgot-link" onClick={(e) => { e.preventDefault(); console.log('[LiveCollab] Forgot Password clicked — placeholder'); }}>
            Forgot Password?
          </Link>

          {error && (
            <p style={{
              color: '#ef4444',
              fontSize: '0.8125rem',
              fontWeight: 500,
              margin: '-8px 0 0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </p>
          )}

          <AuthButton loading={loading}>
            Sign In
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </AuthButton>

          <Divider />

          <GoogleAuthButton label="Continue with Google" />
        </form>

        <div className="auth-footer-links">
          <p className="auth-footer-link">
            Don't have an account?{' '}
            <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
