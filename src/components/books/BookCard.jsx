import React from 'react';
import { Link } from 'react-router-dom';
import ConditionBadge from './ConditionBadge';

export default function BookCard({ listing, distance = '1.2 km' }) {
  if (!listing) return null;

  const hasPhoto = listing.photoUrls && listing.photoUrls.length > 0 && listing.photoUrls[0];

  return (
    <Link to={`/book/${listing.id}`} className="book-card-link">
      <div className="book-card">
        <div className="book-card-photo-wrapper">
          {hasPhoto ? (
            <img
              src={listing.photoUrls[0]}
              alt={listing.title}
              className="book-card-image"
            />
          ) : (
            <div className="book-card-placeholder">
              <span className="book-card-placeholder-icon">📖</span>
              <span className="book-card-placeholder-text">Secondhand Book</span>
            </div>
          )}

          <div className="book-card-badge-top-left">
            <ConditionBadge conditionKey={listing.condition} />
          </div>

          {distance && (
            <div className="book-card-distance-badge">
              {distance}
            </div>
          )}
        </div>

        <div className="book-card-details">
          <h4 className="book-card-title">{listing.title}</h4>
          <p className="book-card-author">by {listing.author}</p>

          <div className="book-card-footer">
            <div className="book-card-pricing">
              <span className="book-card-price">₹{listing.price}</span>
              {listing.mrp && (
                <span className="book-card-mrp">₹{listing.mrp}</span>
              )}
            </div>
            <span className="book-card-locality">📍 {listing.locality}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
