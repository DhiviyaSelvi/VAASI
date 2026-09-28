import React from 'react';
import { Link } from 'react-router-dom';
import ConditionBadge from './ConditionBadge';

export default function BookCard({ listing }) {
  if (!listing) return null;

  return (
    <Link to={`/book/${listing.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--color-line)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: 'var(--color-light-grey)' }}>
          <img
            src={listing.photoUrls?.[0] || 'https://placehold.co/400x500/1F5C56/FFFFFF?text=Book'}
            alt={listing.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
            <ConditionBadge conditionKey={listing.condition} />
          </div>
        </div>

        <div style={{ padding: 'var(--space-md)', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ fontSize: '1.05rem', color: 'var(--color-ink)', marginBottom: '4px', lineHeight: '1.3' }}>
            {listing.title}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-quiet-grey)', marginBottom: 'var(--space-sm)' }}>
            by {listing.author}
          </p>

          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--color-teal)' }}>
                ₹{listing.price}
              </span>
              {listing.mrp && (
                <span style={{ fontSize: '0.8rem', color: 'var(--color-quiet-grey)', textDecoration: 'line-through', marginLeft: '6px' }}>
                  ₹{listing.mrp}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-quiet-grey)' }}>
              📍 {listing.locality}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
