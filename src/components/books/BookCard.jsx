import React from 'react';
import { Link } from 'react-router-dom';
import ConditionBadge from './ConditionBadge';

export default function BookCard({ listing, distance = '1.2 km' }) {
  if (!listing) return null;

  const hasPhoto = listing.photoUrls && listing.photoUrls.length > 0 && listing.photoUrls[0];
  const showDistance = listing.distance || distance;

  return (
    <Link to={`/book/${listing.id}`} className="card">
      <div className="card-top">
        <ConditionBadge conditionKey={listing.condition} />
        {showDistance ? <span className="dist">{showDistance}</span> : null}
      </div>

      <div className="photo">
        {hasPhoto ? (
          <img src={listing.photoUrls[0]} alt={listing.title} />
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z" />
              <path d="M12 6v13.5" />
            </svg>
            Secondhand Copy
          </>
        )}
      </div>

      <div className="card-body">
        <div className="card-title">{listing.title}</div>
        <div className="card-author">by {listing.author}</div>
      </div>

      <div className="card-foot">
        <div className="price-line">
          <span className="price">₹{listing.price}</span>
          {listing.mrp && <span className="mrp">₹{listing.mrp}</span>}
        </div>
        <div className="loc">{listing.locality}</div>
      </div>
    </Link>
  );
}
