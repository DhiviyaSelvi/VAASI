import React from 'react';

// Curated palette of vibrant, high-contrast accessible colors for user avatars
const AVATAR_COLORS = [
  '#0F5148', // Deep Teal
  '#C05621', // Terracotta Rust
  '#2A4365', // Dark Slate Blue
  '#702459', // Royal Plum
  '#9B2C2C', // Crimson Red
  '#22543D', // Forest Green
  '#D69E2E', // Warm Gold
  '#4A5568'  // Neutral Charcoal
];

/**
 * Deterministically pick a background color based on the user's name.
 */
function getAvatarColor(name = '') {
  let hash = 0;
  const str = name.trim().toLowerCase();
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

/**
 * UserAvatar Component
 * - Circle with first initial of user's first name (uppercase)
 * - Consistent background color derived from name
 * - Sizes: 'small' (24px) or 'medium' (40px)
 */
export default function UserAvatar({ name = '', size = 'small', className = '', style = {} }) {
  const firstName = name ? name.trim().split(' ')[0] : 'U';
  const initial = firstName ? firstName[0].toUpperCase() : 'U';
  const backgroundColor = getAvatarColor(name || 'User');
  
  const dim = size === 'small' ? '24px' : '40px';
  const fontSize = size === 'small' ? '11px' : '17px';

  return (
    <div
      className={`user-avatar user-avatar-${size} ${className}`}
      style={{
        width: dim,
        height: dim,
        borderRadius: '50%',
        backgroundColor,
        color: '#FFFFFF',
        fontFamily: 'var(--font-body)',
        fontWeight: '700',
        fontSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        userSelect: 'none',
        boxShadow: '1px 1px 0 var(--ink)',
        border: '1.5px solid var(--ink)',
        ...style
      }}
      title={firstName}
    >
      {initial}
    </div>
  );
}
