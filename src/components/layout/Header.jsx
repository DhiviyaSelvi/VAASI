import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

/**
 * Header Component
 * Below 860px on BookDetail, Sell, and Chat routes, Header hides (top bar replaces it).
 * Includes back button on secondary screens.
 */
export default function Header({ isBookDetail, isSellPage, isChatPage }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isMainTab = ['/', '/sell', '/chat', '/profile'].includes(location.pathname);
  const hideOnMobile = isBookDetail || isSellPage || isChatPage;

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <header className={`site-header ${hideOnMobile ? 'bd-header-mobile-hide' : ''}`}>
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {!isMainTab && (
          <button 
            className="header-back-btn" 
            onClick={handleBack} 
            aria-label="Go Back"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6"/>
            </svg>
          </button>
        )}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
            <path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/>
            <path d="M12 6v13.5"/>
          </svg>
          <div>
            <div className="brand-name">Vaasi</div>
            <div className="brand-tamil">கோயம்புத்தூர் புத்தக சந்தை</div>
          </div>
        </Link>
      </div>

      <nav className="header-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Shelf
        </NavLink>
        <NavLink to="/sell" className={({ isActive }) => (isActive ? 'active' : '')}>
          Sell
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => (isActive ? 'active' : '')}>
          Chat
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
          Profile
        </NavLink>
      </nav>

      <div className="locality-pill">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/>
          <circle cx="12" cy="10" r="2.5"/>
        </svg>
        Gandhipuram
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
    </header>
  );
}
