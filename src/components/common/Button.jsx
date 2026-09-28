import React from 'react';

export default function Button({ children, onClick, variant = 'primary', type = 'button', className = '' }) {
  const baseStyle = {
    padding: '10px 18px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    transition: 'all 0.2s ease',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-teal)',
      color: 'var(--color-surface)',
    },
    secondary: {
      backgroundColor: 'var(--color-marigold)',
      color: 'var(--color-ink)',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid var(--color-teal)',
      color: 'var(--color-teal)',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      style={{ ...baseStyle, ...variants[variant] }}
    >
      {children}
    </button>
  );
}
