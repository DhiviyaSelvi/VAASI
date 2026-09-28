import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

/**
 * BottomNav Component (Mobile)
 * Matches browse-reference.html inline SVGs.
 * Feature 6: "Search" button navigates to "/" and focuses search input.
 */
export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const input = document.querySelector('.search input');
        if (input) input.focus();
      }, 100);
    } else {
      const input = document.querySelector('.search input');
      if (input) input.focus();
    }
  };

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/>
          <path d="M12 6v13.5"/>
        </svg>
        Shelf
      </NavLink>

      <button onClick={handleSearchClick} type="button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7"/>
          <path d="M20 20l-3.5-3.5"/>
        </svg>
        Search
      </button>

      <NavLink to="/sell" className={({ isActive }) => (isActive ? 'active' : '')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="4" y="4" width="16" height="16" rx="1"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
        Sell
      </NavLink>

      <NavLink to="/chat" className={({ isActive }) => (isActive ? 'active' : '')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M4 5h16v11H9l-5 4z"/>
        </svg>
        Chat
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="9" r="4"/>
          <path d="M4 21c1-4.5 4-6 8-6s7 1.5 8 6"/>
        </svg>
        Profile
      </NavLink>
    </nav>
  );
}
