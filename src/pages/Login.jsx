import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function Login() {
  return (
    <div className="placeholder-page" style={{ maxWidth: '400px', margin: '60px auto', textAlign: 'center' }}>
      <h1>Login / Sign Up</h1>
      <p className="placeholder-desc">
        Authentication screen for Coimbatore book buyers and sellers.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <Link to="/">
          <Button variant="primary" style={{ width: '100%' }}>Continue as Guest</Button>
        </Link>
      </div>
    </div>
  );
}
