import React from 'react';
import BookCard from './BookCard';

export default function ShelfRow({ title, listings = [] }) {
  return (
    <section style={{ marginBottom: 'var(--space-xl)' }}>
      {title && (
        <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '1.25rem' }}>
          {title}
        </h3>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 'var(--space-md)'
      }}>
        {listings.map((item) => (
          <BookCard key={item.id} listing={item} />
        ))}
      </div>
    </section>
  );
}
