import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const data = await getCurrentUser();
      setUser(data);
      setLoading(false);
    }
    loadUser();
  }, []);

  return (
    <div className="placeholder-page">
      <h1>My Profile</h1>
      <p className="placeholder-desc">
        Manage listed books, trust ratings, and default handover localities.
      </p>

      {loading ? (
        <p style={{ color: 'var(--color-teal)' }}>⏳ Loading user profile...</p>
      ) : (
        user && (
          <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-paper)', borderRadius: 'var(--radius-sm)' }}>
            <h3>{user.name}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-quiet-grey)' }}>📍 {user.locality} • 🏫 {user.college}</p>
            <p style={{ fontSize: '0.9rem', marginTop: 'var(--space-xs)' }}>⭐ {user.ratingAverage} / 5.0 ({user.ratingCount} ratings)</p>
          </div>
        )
      )}
    </div>
  );
}
