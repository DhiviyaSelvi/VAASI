import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

/**
 * PageShell Layout Wrapper
 * Renders Header & BottomNav for all routes except /login.
 */
export default function PageShell() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-container">
      {!isLoginPage && <Header />}
      
      <main className="main-content">
        <Outlet />
      </main>

      {!isLoginPage && <BottomNav />}
    </div>
  );
}
