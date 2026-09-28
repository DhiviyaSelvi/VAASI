import React from 'react';
import { useListings } from '../hooks/useListings';
import ShelfRow from '../components/books/ShelfRow';
import EmptyState from '../components/common/EmptyState';

export default function Browse() {
  const { listings, loading, error } = useListings();

  return (
    <div className="placeholder-page">
      <h1>Browse Secondhand Books</h1>
      <p className="placeholder-desc">
        Explore pre-loved textbooks, fiction, and literature available across Coimbatore localities.
      </p>

      {loading && (
        <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--color-teal)' }}>
          ⏳ Fetching listings from service...
        </div>
      )}

      {error && (
        <div style={{ color: 'red', padding: 'var(--space-md)' }}>
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {listings.length > 0 ? (
            <ShelfRow title="Recent Listings in Coimbatore" listings={listings} />
          ) : (
            <EmptyState title="No books listed yet" message="Be the first to list a secondhand book!" />
          )}
        </>
      )}
    </div>
  );
}
