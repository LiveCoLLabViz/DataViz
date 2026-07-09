import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 12, fontFamily: 'inherit',
    }}
    >
      <h1 style={{ fontSize: 48, margin: 0, color: '#111827' }}>404</h1>
      <p style={{ color: '#6B7280', margin: 0 }}>Page not found.</p>
      <Link to="/workspace" style={{ color: '#2563EB', fontWeight: 600 }}>Back to workspace</Link>
    </div>
  );
}
