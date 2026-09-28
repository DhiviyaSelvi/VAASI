import React from 'react';
import BookCard from './BookCard';

export default function ShelfRow({ eyebrow, title, listings = [] }) {
  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <section className="shelf-section">
      <div className="shelf-header">
        <div>
          {eyebrow && <span className="shelf-eyebrow">{eyebrow}</span>}
          <h3 className="shelf-title">{title}</h3>
        </div>
        <span className="shelf-see-all">See all ({listings.length})</span>
      </div>

      <div className="shelf-container">
        {listings.map((item) => (
          <BookCard key={item.id} listing={item} />
        ))}
      </div>
    </section>
  );
}
