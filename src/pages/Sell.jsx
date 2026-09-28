import React from 'react';
import Button from '../components/common/Button';

export default function Sell() {
  return (
    <div className="placeholder-page">
      <h1>Sell a Secondhand Book</h1>
      <p className="placeholder-desc">
        List your pre-loved book in 60 seconds for Coimbatore buyers.
      </p>
      <div style={{ marginTop: 'var(--space-md)' }}>
        <p style={{ marginBottom: 'var(--space-md)', color: 'var(--color-quiet-grey)' }}>
          [Form Placeholders: Title, Author, Category, Condition, Price, Photos, Locality]
        </p>
        <Button variant="primary">Submit Listing (Placeholder)</Button>
      </div>
    </div>
  );
}
