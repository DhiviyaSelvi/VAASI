import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentAuthState, isAuthInitialized, subscribeAuthState } from '../services/authService';

/**
 * Route protection wrapper.
 * Waits for Firebase auth state initialization before checking authentication.
 * Redirects unauthenticated users to /login passing location state.
 */
export default function RequireAuth({ children }) {
  const location = useLocation();
  const [initialized, setInitialized] = useState(isAuthInitialized());
  const [isAuthenticated, setIsAuthenticated] = useState(getCurrentAuthState());

  useEffect(() => {
    const unsubscribe = subscribeAuthState((user) => {
      setInitialized(true);
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (!initialized) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--paper)', minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <div style={{ font: '700 13px var(--font-body)', color: 'var(--ink-quiet)' }}>
          Checking authentication...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
