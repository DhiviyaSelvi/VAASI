import React from 'react';
import { Link } from 'react-router-dom';
import ConditionBadge from './ConditionBadge';
import ListingImage from '../common/ListingImage';
import UserAvatar from '../common/UserAvatar';

export default function BookCard({ listing, distance = '1.2 km' }) {
  if (!listing) return null;

  const showDistance = listing.distance || distance;
  const photoUrl = listing.photoUrls && listing.photoUrls.length > 0 ? listing.photoUrls[0] : null;
  const sellerFirstName = (listing.sellerName || 'Seller').trim().split(' ')[0];

  return (
    <Link to={`/book/${listing.id}`} className="card">
      <div className="card-top">
        <ConditionBadge conditionKey={listing.condition} />
        {showDistance ? <span className="dist">{showDistance}</span> : null}
      </div>

      <div className="photo">
        <ListingImage 
          src={photoUrl} 
          alt={listing.title} 
          title={listing.title} 
          fallbackIconSize={20}
        />
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
        <div className="seller-meta" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
          <UserAvatar name={sellerFirstName} size="small" />
          <span className="loc" style={{ margin: 0 }}>{sellerFirstName} · {listing.locality || 'Peelamedu'}</span>
        </div>
      </div>
    </Link>
  );
}
