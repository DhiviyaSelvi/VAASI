import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="placeholder-page" style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-md)' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--color-marigold)' }}>404</h1>
      <h2>Page Not Found</h2>
      <p className="placeholder-desc" style={{ marginTop: 'var(--space-xs)', marginBottom: 'var(--space-lg)' }}>
        The book or route you are looking for does not exist in Vaasi.
      </p>
      <Link to="/">
        <Button variant="primary">Return to Browse</Button>
      </Link>
    </div>
  );
}
