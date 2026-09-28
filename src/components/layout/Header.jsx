import React from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * Header Component
 * Clarification 1: Logo & Locality pill stay visible at ALL screen sizes.
 * Only desktop nav links hide below 860px (where BottomNav takes over).
 */
export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-brand">
          <Link to="/" className="brand-logo">
            Vaasi
          </Link>
          <div className="locality-pill" title="Current Location">
            📍 Coimbatore
          </div>
        </div>

        {/* Links shown only above 860px */}
        <nav className="desktop-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Browse
          </NavLink>
          <NavLink to="/sell" className={({ isActive }) => (isActive ? 'active' : '')}>
            Sell Book
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => (isActive ? 'active' : '')}>
            Chats
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
            Profile
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
