import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { auth } from '../../firebase';
import { getConversationsForUser, isConversationUnread } from '../../services/chatService';

/**
 * BottomNav Component (Persistent 4-tab bar)
 * - Browse, Sell, Chat, Profile
 * - Deep teal active state, muted inactive
 * - Small marigold badge for unread chat count
 * - Fixed bottom with safe-area inset support
 */
export default function BottomNav() {
  const [unreadCount, setUnreadCount] = useState(0);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser?.uid) {
      setUnreadCount(0);
      return;
    }

    const unsubscribe = getConversationsForUser(currentUser.uid, (convList) => {
      const count = convList.filter(conv => isConversationUnread(conv, currentUser.uid)).length;
      setUnreadCount(count);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser?.uid]);

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
          <path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/>
          <path d="M12 6v13.5"/>
        </svg>
        <span>Browse</span>
      </NavLink>

      <NavLink to="/sell" className={({ isActive }) => (isActive ? 'active' : '')}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <rect x="4" y="4" width="16" height="16" rx="1"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
        <span>Sell</span>
      </NavLink>

      <NavLink to="/chat" end className={({ isActive }) => (isActive ? 'active' : '')} style={{ position: 'relative' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
          <path d="M4 5h16v11H9l-5 4z"/>
        </svg>
        <span>Chat</span>
        {unreadCount > 0 && (
          <span className="bottom-nav-unread-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="12" cy="9" r="4"/>
          <path d="M4 21c1-4.5 4-6 8-6s7 1.5 8 6"/>
        </svg>
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
