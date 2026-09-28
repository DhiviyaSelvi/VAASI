import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * BottomNav Component
 * Mobile-only bottom navigation bar (hidden at 860px and above via CSS).
 */
export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">📚</span>
        <span>Browse</span>
      </NavLink>

      <NavLink to="/sell" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">➕</span>
        <span>Sell</span>
      </NavLink>

      <NavLink to="/chat" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">💬</span>
        <span>Chat</span>
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">👤</span>
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
