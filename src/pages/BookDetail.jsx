import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListingById } from '../services/listingsService';
import ConditionBadge from '../components/books/ConditionBadge';
import Button from '../components/common/Button';

export default function BookDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchBook() {
      try {
        setLoading(true);
        const data = await getListingById(id);
        if (isMounted) setListing(data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchBook();
    return () => { isMounted = false; };
  }, [id]);

  return (
    <div className="placeholder-page">
      <h1>Book Details Placeholder</h1>
      <p className="placeholder-desc">Detailed view of book listing #{id}, seller details, and handover location.</p>

      {loading && <p style={{ color: 'var(--color-teal)' }}>⏳ Loading book details...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && listing && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>
          <div>
            <img src={listing.photoUrls[0]} alt={listing.title} style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
          </div>
          <div>
            <h2>{listing.title}</h2>
            <p style={{ color: 'var(--color-quiet-grey)', marginBottom: 'var(--space-sm)' }}>by {listing.author}</p>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <ConditionBadge conditionKey={listing.condition} />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-teal)', marginBottom: 'var(--space-md)' }}>₹{listing.price}</h3>
            <p style={{ marginBottom: 'var(--space-md)' }}>{listing.description}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-quiet-grey)', marginBottom: 'var(--space-lg)' }}>
              Seller: <strong>{listing.sellerName}</strong> (📍 {listing.locality})
            </p>
            <Link to="/chat">
              <Button variant="secondary">Chat with Seller</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
