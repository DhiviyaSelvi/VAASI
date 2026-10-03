import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

/**
 * PageShell Layout Wrapper
 * - Persistent BottomNav on main tab routes (/ , /sell, /chat, /profile).
 * - Hides BottomNav on secondary routes (/login, /book/:id, /chat/:id).
 */
export default function PageShell() {
  const location = useLocation();
  const isMainTab = ['/', '/sell', '/chat', '/profile'].includes(location.pathname);

  const isLoginPage = location.pathname === '/login';
  const isBookDetail = location.pathname.startsWith('/book/');
  const isSellPage = location.pathname === '/sell';
  const isChatDetail = location.pathname.startsWith('/chat/');

  return (
    <div className={`app-container ${isBookDetail ? 'is-book-detail-page' : ''} ${isSellPage ? 'is-sell-page' : ''} ${isChatDetail ? 'is-chat-page' : ''}`}>
      {!isLoginPage && <Header isBookDetail={isBookDetail} isSellPage={isSellPage} isChatPage={isChatDetail} />}
      
      <main className={`main-content ${isMainTab ? 'has-bottom-nav' : ''}`}>
        <Outlet />
      </main>

      {isMainTab && <BottomNav />}
    </div>
  );
}
