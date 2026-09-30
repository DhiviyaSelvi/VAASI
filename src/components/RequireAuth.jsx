import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentAuthState } from '../services/authService';

/**
 * Route protection wrapper.
 * Redirects unauthenticated users to /login passing location state.
 */
export default function RequireAuth({ children }) {
  const location = useLocation();
  const isAuthenticated = getCurrentAuthState();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
