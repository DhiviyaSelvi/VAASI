import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getListingById, markSold } from '../services/listingsService';
import { getCurrentUser } from '../services/authService';
import ConditionBadge from '../components/books/ConditionBadge';
import Button from '../components/common/Button';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [bookData, userData] = await Promise.all([
          getListingById(id),
          getCurrentUser().catch(() => null)
        ]);

        if (isMounted) {
          setListing(bookData);
          setCurrentUser(userData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Listing not found');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleMarkSold = async () => {
    if (!listing) return;
    try {
      const updated = await markSold(listing.id);
      setListing(updated);
    } catch (err) {
      alert('Failed to mark listing as sold');
    }
  };

  // Safe discount percentage calculation
  const hasDiscount = listing?.mrp && listing?.price && listing.mrp > listing.price;
  const percentOff = hasDiscount
    ? Math.round(((listing.mrp - listing.price) / listing.mrp) * 100)
    : 0;

  // Seller first name for Message button
  const sellerFirstName = listing?.sellerName?.split(' ')[0] || 'Seller';

  // Quick offer amounts (88% and 94%, rounded to nearest 10)
  const offer88 = listing?.price ? Math.round((listing.price * 0.88) / 10) * 10 : 0;
  const offer94 = listing?.price ? Math.round((listing.price * 0.94) / 10) * 10 : 0;

  const photoList = listing?.photoUrls || [];
  const hasPhotos = photoList.length > 0;
  const isOwner = currentUser && listing && currentUser.id === listing.sellerId;

  return (
    <div className="bd-wrap">
      {/* Top Navigation & Action Bar */}
      <div className="bd-top-bar">
        <button onClick={() => navigate(-1)} className="bd-back-btn" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {listing?.locality && (
          <div className="bd-pickup-tag">
            <span>📍 Pickup near {listing.locality}</span>
          </div>
        )}

        <div className="bd-top-actions">
          <button className="bd-icon-btn" title="Share" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
            </svg>
          </button>
          <button className="bd-icon-btn" title="Save" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bd-grid">
          <div className="skeleton-card" style={{ height: '350px' }}></div>
          <div className="skeleton-card" style={{ height: '350px' }}></div>
        </div>
      )}

      {/* Error / Not Found State */}
      {error && !loading && (
        <div className="error-container" style={{ margin: '40px auto', maxWidth: '450px' }}>
          <h2 style={{ color: 'var(--ink)' }}>Listing Not Found</h2>
          <p className="error-message">The book listing #{id} could not be found or has been removed.</p>
          <Link to="/">
            <Button variant="primary">Return to Browse</Button>
          </Link>
        </div>
      )}

      {/* Book Detail Content */}
      {!loading && !error && listing && (
        <div className="bd-grid">
          {/* Left Column: Photos / Gallery */}
          <div className="bd-gallery">
            <div className="bd-hero">
              {hasPhotos ? (
                <img src={photoList[activePhotoIdx] || photoList[0]} alt={listing.title} />
              ) : (
                <div className="bd-placeholder-hero">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                    <path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/>
                    <path d="M12 6v13.5"/>
                  </svg>
                  <span>Secondhand Copy</span>
                </div>
              )}

              {hasPhotos && photoList.length > 1 && (
                <div className="bd-photo-counter">
                  {activePhotoIdx + 1} of {photoList.length} Photos
                </div>
              )}
            </div>

            {hasPhotos && photoList.length > 1 && (
              <div className="bd-thumbs">
                {photoList.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`bd-thumb ${activePhotoIdx === idx ? 'active' : ''}`}
                    onClick={() => setActivePhotoIdx(idx)}
                  >
                    <img src={url} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Listing Details */}
          <div className="bd-details">
            <div className="bd-main-card">
              <div className="bd-category-tags">
                <span className="bd-tag">{listing.category}</span>
              </div>

              <h1 className="bd-title">{listing.title}</h1>
              <p className="bd-author">by {listing.author} {listing.publisher ? `• ${listing.publisher}` : ''}</p>

              <div className="bd-price-row">
                <span className="bd-price">₹{listing.price}</span>
                {listing.mrp && <span className="bd-mrp">₹{listing.mrp}</span>}
                {hasDiscount && <span className="bd-off-tag">{percentOff}% OFF</span>}
              </div>

              <div className="bd-meta-row">
                <ConditionBadge conditionKey={listing.condition} />
                <span className="bd-meta-item">📍 {listing.locality}</span>
                {listing.status === 'sold' && (
                  <span style={{ color: '#EF4444', fontWeight: '700' }}>[SOLD]</span>
                )}
              </div>
            </div>

            {/* Quick Offers Row: Hidden if viewer owns listing */}
            {!isOwner && (
              <div className="bd-quick-offers">
                <div className="bd-quick-title">⚡ Make a Fast Offer</div>
                <div className="bd-offer-buttons">
                  <Link to="/chat" className="bd-offer-btn">
                    Offer ₹{offer88}
                  </Link>
                  <Link to="/chat" className="bd-offer-btn">
                    Offer ₹{offer94}
                  </Link>
                </div>
              </div>
            )}

            {/* Description Section */}
            {listing.description && (
              <div className="bd-section-card">
                <div className="bd-section-title">Description &amp; Condition Notes</div>
                <div className="bd-description-text">{listing.description}</div>
              </div>
            )}

            {/* Action Bar */}
            <div className="bd-action-bar">
              {!isOwner ? (
                <>
                  <Link to="/chat" className="bd-btn-message">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                      <path d="M4 5h16v11H9l-5 4z" />
                    </svg>
                    Message {sellerFirstName}
                  </Link>
                  <Link to="/chat" className="bd-btn-meetup">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Schedule Meetup
                  </Link>
                </>
              ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    This is your listing.
                  </p>
                  {listing.status !== 'sold' && (
                    <button onClick={handleMarkSold} className="bd-btn-sold" type="button" style={{ width: '100%' }}>
                      Mark as Sold
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
