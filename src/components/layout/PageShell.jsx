import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

/**
 * PageShell Layout Wrapper
 * - Hides Header & BottomNav on /login.
 * - Hides BottomNav on /book/:id (replaced by fixed action bar).
 * - Below 860px (mobile), hides Header on /book/:id (replaced by top back bar).
 */
export default function PageShell() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isBookDetail = location.pathname.startsWith('/book/');
  const isSellPage = location.pathname === '/sell';
  const isChatPage = location.pathname.startsWith('/chat/');

  return (
    <div className={`app-container ${isBookDetail ? 'is-book-detail-page' : ''} ${isSellPage ? 'is-sell-page' : ''} ${isChatPage ? 'is-chat-page' : ''}`}>
      {!isLoginPage && <Header isBookDetail={isBookDetail} isSellPage={isSellPage} isChatPage={isChatPage} />}
      
      <main className="main-content">
        <Outlet />
      </main>

      {!isLoginPage && !isBookDetail && !isSellPage && !isChatPage && <BottomNav />}
    </div>
  );
}
