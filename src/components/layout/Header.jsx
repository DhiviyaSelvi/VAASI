import React from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * Header Component
 * Below 860px on BookDetail route, Header hides (top back bar replaces it).
 */
export default function Header({ isBookDetail }) {
  return (
    <header className={`site-header ${isBookDetail ? 'bd-header-mobile-hide' : ''}`}>
      <div className="brand">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
          <path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/>
          <path d="M12 6v13.5"/>
        </svg>
        <div>
          <div className="brand-name">Vaasi</div>
          <div className="brand-tamil">கோயம்புத்தூர் புத்தக சந்தை</div>
        </div>
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
