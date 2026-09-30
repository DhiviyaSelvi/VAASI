import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getListingById, markSold } from '../services/listingsService';
import { getCurrentUser, getUserById } from '../services/authService';
import { getOrCreateConversationForListing } from '../services/chatService';
import ConditionBadge from '../components/books/ConditionBadge';
import Button from '../components/common/Button';
import '../styles/book-detail.css';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [sellerUser, setSellerUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isNavigatingChat, setIsNavigatingChat] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [bookData, userData] = await Promise.all([
          getListingById(id),
          getCurrentUser().catch(() => null)
        ]);

        let sellerProfile = null;
        if (bookData?.sellerId) {
          try {
            sellerProfile = await getUserById(bookData.sellerId);
          } catch (e) {
            sellerProfile = null; // Hide seller card gracefully if fetch fails
          }
        }

        if (isMounted) {
          setListing(bookData);
          setCurrentUser(userData);
          setSellerUser(sellerProfile);
          setError(null);
          setActivePhotoIdx(0);
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

  const handleChatNavigate = async (e) => {
    e.preventDefault();
    if (!listing || !listing.sellerId) return;
    try {
      setIsNavigatingChat(true);
      const convId = await getOrCreateConversationForListing(id, listing.sellerId);
      navigate('/chat/' + convId);
    } catch (err) {
      console.error('Failed to initiate chat', err);
      setIsNavigatingChat(false);
    }
  };

  const hasDiscount = listing?.mrp && listing?.price && listing.mrp > listing.price;
  const percentOff = hasDiscount
    ? Math.round(((listing.mrp - listing.price) / listing.mrp) * 100)
    : 0;

  const sellerFirstName = (sellerUser?.name || listing?.sellerName)?.split(' ')[0] || 'Seller';
  let offer88 = listing?.price ? Math.round((listing.price * 0.88) / 10) * 10 : 0;
  let offer94 = listing?.price ? Math.round((listing.price * 0.94) / 10) * 10 : 0;
  if (offer88 === offer94 && offer88 >= 20) {
    offer88 -= 10;
  }

  const photoList = listing?.photoUrls || [];
  const hasPhotos = photoList.length > 0;
  const isOwner = currentUser && listing && currentUser.id === listing.sellerId;

  // Compute seller initials for avatar
  const sellerFullName = sellerUser?.name || listing?.sellerName || 'Seller';
  const sellerInitials = sellerFullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const getThumbLabel = (index) => {
    if (index === 0) return 'Cover';
    return `Photo ${index + 1}`;
  };

  // Check if seller note card has any content
  const hasSellerNoteContent = Boolean(
    listing?.sellerNote ||
      listing?.edition ||
      listing?.pages ||
      listing?.language ||
      listing?.extras
  );

  const sellerSubLine = [sellerUser?.yearAndDept, sellerUser?.college]
    .filter(Boolean)
    .join(', ');

  const hasStats =
    sellerUser?.avgResponseMins !== undefined &&
    sellerUser?.fulfilledPercent !== undefined;

  return (
    <div className="bd-page">
      {/* Top Header Bar */}
      <header className="detail-top">
        <button onClick={() => navigate(-1)} className="icon-btn" type="button" aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6"/>
          </svg>
        </button>
        <div className="detail-loc">
          <div className="eyebrow">PICKUP AREA</div>
          <div className="loc-name">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/>
              <circle cx="12" cy="10" r="2.5"/>
            </svg>
            {listing?.locality
              ? `PSG Tech, ${listing.locality}`
              : 'PSG Tech, Peelamedu'}
          </div>
        </div>
        <div className="top-actions">
          <button className="icon-btn" aria-label="Share" type="button">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="2.5"/>
              <circle cx="6" cy="12" r="2.5"/>
              <circle cx="18" cy="19" r="2.5"/>
              <path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6"/>
            </svg>
          </button>
          <button className="icon-btn" aria-label="Save" type="button">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
              <path d="M6 3h12v18l-6-4.5L6 21z"/>
            </svg>
          </button>
        </div>
      </header>

      <main className="detail-wrap">
        {loading && (
          <div className="detail-grid">
            <div className="skeleton-card" style={{ height: '350px' }}></div>
            <div className="skeleton-card" style={{ height: '350px' }}></div>
          </div>
        )}

        {error && !loading && (
          <div className="error-container">
            <h2>Listing Not Found</h2>
            <p className="error-message">The book listing #{id} could not be found or has been removed.</p>
            <Link to="/" style={{ marginTop: '12px', display: 'inline-block' }}>
              <Button variant="primary">Return to Browse</Button>
            </Link>
          </div>
        )}

        {!loading && !error && listing && (
          <div className="detail-grid">
            {/* Left Column: Photos */}
            <section className="col-media">
              <div className="photo-card">
                <span className="seller-badge">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M12 11v5M12 8h.01" strokeLinecap="round"/>
                  </svg>
                  Condition described by seller
                </span>

                <div className="hero-photo">
                  {hasPhotos ? (
                    <img
                      src={photoList[activePhotoIdx] || photoList[0]}
                      alt={listing.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <>
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                        <path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/>
                        <path d="M12 6v13.5"/>
                      </svg>
                      No photo added yet
                    </>
                  )}
                </div>

                {hasPhotos && photoList.length > 0 && (
                  <span className="photo-count">
                    {activePhotoIdx + 1} of {photoList.length} Photos
                  </span>
                )}
              </div>

              {hasPhotos && photoList.length > 0 && (
                <div className="thumbs">
                  {photoList.map((url, idx) => (
                    <div
                      key={idx}
                      className={`thumb ${activePhotoIdx === idx ? 'active' : ''}`}
                      onClick={() => setActivePhotoIdx(idx)}
                    >
                      <div className="thumb-img">
                        <img src={url} alt={`Thumb ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div className="thumb-label">{getThumbLabel(idx)}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Right Column: Info & Details */}
            <section className="col-info">
              {/* Card 1: Title & Price */}
              <div className="card">
                <div className="tags-line">
                  {listing.category} {listing.editionNote ? `• ${listing.editionNote}` : ''}
                </div>
                <h1 className="book-title">{listing.title}</h1>
                <div className="book-by">
                  By <b>{listing.author}</b> {listing.publisher ? `• ${listing.publisher}` : ''}
                </div>

                <div className="price-area">
                  <div className="label-caps">Seller's asking price</div>
                  <div className="price-row">
                    <div className="price-left">
                      <span className="price">₹{listing.price}</span>
                      {listing.mrp && <span className="mrp">₹{listing.mrp}</span>}
                      {hasDiscount && <span className="off">{percentOff}% OFF</span>}
                    </div>
                    <span className="fixed-pill">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
                        <rect x="5" y="11" width="14" height="10"/>
                        <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
                      </svg>
                      Fixed Price
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Seller's Description */}
              <div className="card">
                <div className="desc-head">
                  <span className="label-caps" style={{ color: 'var(--ink)' }}>Seller's Description</span>
                  <ConditionBadge conditionKey={listing.condition} />
                </div>

                {listing.description && (
                  <blockquote className="quote">
                    "{listing.description}"
                  </blockquote>
                )}

                {listing.checklist && listing.checklist.length > 0 && (
                  <div className="checks">
                    {listing.checklist.map((chk, i) => (
                      <div className="check" key={i}>
                        {chk.status === 'yes' ? (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#0F5148" />
                            <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <span className="dot"></span>
                        )}
                        {chk.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* NEW SECTION 1: Seller Card (Hidden for owner) */}
              {!isOwner && sellerUser && (
                <div className="card seller-card">
                  <div className="seller-head">
                    <div className="avatar">{sellerInitials}</div>
                    <div className="seller-id">
                      <div className="seller-name">
                        {sellerUser.name || listing.sellerName}
                        {sellerUser.collegeEmailVerified && (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#0F5148" />
                            <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      {sellerSubLine && (
                        <div className="seller-sub">{sellerSubLine}</div>
                      )}
                    </div>

                    {sellerUser.ratingCount > 0 && (
                      <div className="rating-box">
                        ★ {sellerUser.rating || 5.0}{' '}
                        <small>({sellerUser.ratingCount} sold)</small>
                      </div>
                    )}
                  </div>

                  <div className="hub-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/>
                      <circle cx="12" cy="10" r="2.5"/>
                    </svg>
                    <div>
                      <div className="label-caps">Listing hub</div>
                      <div className="hub-name">
                        {listing.locality}
                        {listing.landmark ? `, ${listing.landmark}` : ''}
                      </div>
                    </div>
                  </div>

                  {listing.handoffNote && (
                    <div className="handoff">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
                        <path d="M3 12l9-9h8v8l-9 9z"/>
                        <circle cx="16" cy="8" r="1.4"/>
                      </svg>
                      <div>
                        <div className="label-caps">Campus handoff window</div>
                        <p>"{listing.handoffNote}"</p>
                      </div>
                    </div>
                  )}

                  {hasStats && (
                    <div className="stat-grid">
                      <div className="stat-box">
                        <div className="label-caps">Avg response time</div>
                        <b>~{sellerUser.avgResponseMins} mins</b>
                      </div>
                      <div className="stat-box">
                        <div className="label-caps">Community trust</div>
                        <b>{sellerUser.fulfilledPercent}% Fulfilled</b>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* NEW SECTION 2: Seller Note & Contents Card */}
              {hasSellerNoteContent && (
                <div className="card">
                  <div className="note-head">
                    <span className="label-caps" style={{ color: 'var(--ink)' }}>
                      Seller note &amp; contents
                    </span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>

                  {listing.sellerNote && (
                    <p className="note-quote">"{listing.sellerNote}"</p>
                  )}

                  {(listing.edition || listing.pages || listing.language || listing.extras) && (
                    <div className="spec-table">
                      {listing.edition && (
                        <div className="spec-row">
                          <span>Edition:</span>
                          <b>{listing.edition}</b>
                        </div>
                      )}
                      {listing.pages && (
                        <div className="spec-row">
                          <span>Pages:</span>
                          <b>{listing.pages}</b>
                        </div>
                      )}
                      {listing.language && (
                        <div className="spec-row">
                          <span>Language:</span>
                          <b>{listing.language}</b>
                        </div>
                      )}
                      {listing.extras && (
                        <div className="spec-row">
                          <span>Free extra:</span>
                          <b>{listing.extras}</b>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* NEW SECTION 3: Safety Note (Hidden for owner) */}
              {!isOwner && (
                <div className="safety-note">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span>
                    Inspect the book at the meetup before you pay. The book price is paid in person, never online.
                  </span>
                </div>
              )}

              {/* Action Bar */}
              <div className="action-bar">
                {!isOwner ? (
                  <>
                    <div className="quick-row">
                      <span className="label-caps">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
                          <path d="M3 12l9-9h8v8l-9 9z"/>
                          <circle cx="16" cy="8" r="1.4"/>
                        </svg>
                        Quick offer:
                      </span>
                      <div className="offer-btns">
                        <button onClick={handleChatNavigate} className="offer-btn" disabled={isNavigatingChat}>
                          Offer ₹{offer88}
                        </button>
                        <button onClick={handleChatNavigate} className="offer-btn" disabled={isNavigatingChat}>
                          Offer ₹{offer94}
                        </button>
                      </div>
                    </div>

                    <div className="main-btns">
                      <button onClick={handleChatNavigate} className="big-btn message" disabled={isNavigatingChat}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
                          <path d="M4 5h16v11H9l-5 4z"/>
                        </svg>
                        Message {sellerFirstName}
                      </button>
                      <button onClick={handleChatNavigate} className="big-btn meetup" disabled={isNavigatingChat}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
                          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>
                        </svg>
                        Meetup
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="owner-view">
                    <div className="seller-line" style={{ marginTop: 0 }}>This is your listing.</div>
                    {listing.status !== 'sold' ? (
                      <button onClick={handleMarkSold} className="big-btn meetup" type="button" style={{ width: '100%' }}>
                        Mark as Sold
                      </button>
                    ) : (
                      <div className="seller-line" style={{ marginTop: 4, fontWeight: 700 }}>This listing has been marked as Sold.</div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
