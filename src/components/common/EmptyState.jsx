import React from 'react';

export default function EmptyState({ title = 'No items found', message = 'Check back later for new book listings.' }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-2xl) var(--space-md)',
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px border-dashed var(--color-line)'
    }}>
      <h3 style={{ marginBottom: 'var(--space-xs)', color: 'var(--color-teal)' }}>{title}</h3>
      <p style={{ color: 'var(--color-quiet-grey)', fontSize: '0.9rem' }}>{message}</p>
    </div>
  );
}
