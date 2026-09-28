import React from 'react';
import BookCard from './BookCard';

export default function ShelfRow({ eyebrow, title, listings = [] }) {
  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <section className="shelf">
      <div className="shelf-head">
        <div>
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h2>{title}</h2>
        </div>
        <span className="see-all">See all ({listings.length})</span>
      </div>

      <div className="shelf-row">
        {listings.map((item) => (
          <BookCard key={item.id} listing={item} />
        ))}
      </div>
    </section>
  );
}
