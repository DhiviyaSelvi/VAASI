import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, getUserById, logoutUser } from '../services/authService';
import { getListingsBySeller, getPurchasedListings, markSold, updateListingPrice } from '../services/listingsService';
import { getMeetupInfoForListing } from '../services/chatService';
import { checkPrice } from '../utils/pricing';
import ConditionBadge from '../components/books/ConditionBadge';
import '../styles/profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'sold' | 'bought'
  const [loading, setLoading] = useState(true);

  // Profile listings & meetup details map
  const [sellerListings, setSellerListings] = useState([]);
  const [purchasedListings, setPurchasedListings] = useState([]);
  const [meetupInfoMap, setMeetupInfoMap] = useState({});

  // Price edit state: { [listingId]: { price: string, error: string | null } }
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editPriceVal, setEditPriceVal] = useState('');
  const [editPriceErr, setEditPriceErr] = useState(null);

  // Dev user switching state for testing empty states vs active user ('real' | mock user id)
  const [selectedUserId, setSelectedUserId] = useState('real');

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);
        // Load user profile
        let userObj = null;
        if (selectedUserId === 'real') {
          userObj = await getCurrentUser();
        } else {
          userObj = await getUserById(selectedUserId);
        }
        setCurrentUser(userObj);

        if (userObj) {
          // Fetch user's listings (as seller) and purchases (as buyer)
          const [sListings, pListings] = await Promise.all([
            getListingsBySeller(userObj.id),
            getPurchasedListings(userObj.id)
          ]);
          
          setSellerListings(sListings);
          setPurchasedListings(pListings);

          // Fetch meetup info for any reserved listings
          const reservedItems = sListings.filter((l) => l.status === 'reserved');
          const meetupMap = {};
          await Promise.all(
            reservedItems.map(async (item) => {
              const info = await getMeetupInfoForListing(item.id);
              if (info) {
                meetupMap[item.id] = info;
              }
            })
          );
          setMeetupInfoMap(meetupMap);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, [selectedUserId]);

  // Dynamic lists by status
  const activeListings = sellerListings.filter((l) => l.status === 'available' || l.status === 'reserved');
  const soldListings = sellerListings.filter((l) => l.status === 'sold');

  // Stats calculation
  const totalSavedVsMrp = purchasedListings.reduce((sum, item) => {
    if (item.mrp && item.mrp > item.price) {
      return sum + (item.mrp - item.price);
    }
    return sum;
  }, 0);

  const totalEarned = soldListings.reduce((sum, item) => sum + (item.price || 0), 0);

  // User details formatting
  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const memberSinceFormatted = currentUser?.memberSince
    ? new Date(currentUser.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Aug 2026';

  const userSubMeta = [
    currentUser?.college,
    currentUser?.locality ? `${currentUser.locality}, Coimbatore` : 'Coimbatore'
  ]
    .filter(Boolean)
    .join(' · ');

  // Handlers
  const handleMarkAsSold = async (listingId, buyerId) => {
    try {
      const updated = await markSold(listingId, buyerId);
      setSellerListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, status: 'sold', buyerId: updated.buyerId } : l))
      );
    } catch (err) {
      console.error('Failed to mark as sold', err);
    }
  };

  const handleStartEditPrice = (item) => {
    setEditingPriceId(item.id);
    setEditPriceVal(item.price.toString());
    setEditPriceErr(null);
  };

  const handleCancelEditPrice = () => {
    setEditingPriceId(null);
    setEditPriceVal('');
    setEditPriceErr(null);
  };

  const handleSavePrice = async (item) => {
    const numPrice = parseInt(editPriceVal, 10);
    const checkRes = checkPrice(numPrice, item.mrp);
    if (!checkRes.valid) {
      setEditPriceErr(checkRes.error);
      return;
    }

    try {
      const updated = await updateListingPrice(item.id, numPrice);
      setSellerListings((prev) =>
        prev.map((l) => (l.id === item.id ? { ...l, price: updated.price } : l))
      );
      setEditingPriceId(null);
    } catch (err) {
      setEditPriceErr('Failed to update price');
    }
  };

  if (loading) {
    return (
      <main className="pf-wrap" style={{ paddingTop: '20px' }}>
        <div className="pf-card">Loading profile data...</div>
      </main>
    );
  }

  return (
    <main className="pf-wrap">
      {/* Dev Switcher for thorough testing */}
      <div className="pf-dev-user-select" style={{ justifyContent: 'space-between' }}>
        {import.meta.env.DEV && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Dev Switch Profile View:</span>
            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
              <option value="real">My Real Account (Google Auth + Firestore)</option>
              <option value="user_101">Kavitha R (Mock: Active + Sold + Purchases)</option>
              <option value="user_103">Deepak S (Mock: Zero Sales Test - 1 Purchase)</option>
              <option value="user_105">Priya N (Mock: Zero Sales & Zero Purchases Test)</option>
            </select>
          </div>
        )}
        <button 
          className="pf-signout-btn"
          style={{ marginLeft: import.meta.env.DEV ? '0' : 'auto' }}
          onClick={async () => {
            await logoutUser();
            navigate('/login');
          }}
        >
          Sign out
        </button>
      </div>

      {/* Profile Card */}
      <div className="pf-card">
        <div className="pf-top">
          <div className="pf-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="pf-name">{currentUser?.name || 'User Profile'}</div>
            <div className="pf-meta">
              {userSubMeta}
              <br />
              Member since {memberSinceFormatted}
            </div>
          </div>
          <div className="pf-rating-inline">
            {currentUser?.ratingCount && currentUser.ratingCount > 0 ? (
              <>
                ★ {currentUser.ratingAverage || currentUser.rating || 5.0}
                <small>({currentUser.ratingCount} ratings)</small>
              </>
            ) : (
              <>
                ★ —<small>No ratings yet</small>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stat Row */}
      <div className="pf-stat-row">
        <div className="pf-stat-box">
          <div className="label">Active Listings</div>
          <div className="value">{activeListings.length}</div>
        </div>
        <div className="pf-stat-box accent">
          <div className="label">Saved vs MRP</div>
          <div className="value">₹{totalSavedVsMrp}</div>
          <div className="sub">{purchasedListings.length > 0 ? 'on books bought' : 'no purchases yet'}</div>
        </div>
        <div className="pf-stat-box">
          <div className="label">Earned</div>
          <div className="value">₹{totalEarned}</div>
          <div className="sub">{soldListings.length > 0 ? 'from sales' : 'no sales yet'}</div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="pf-tab-row">
        <button
          className={`pf-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          My Listings ({activeListings.length})
        </button>
        <button
          className={`pf-tab-btn ${activeTab === 'sold' ? 'active' : ''}`}
          onClick={() => setActiveTab('sold')}
        >
          Sold History ({soldListings.length})
        </button>
        <button
          className={`pf-tab-btn ${activeTab === 'bought' ? 'active' : ''}`}
          onClick={() => setActiveTab('bought')}
        >
          Books I Bought ({purchasedListings.length})
        </button>
      </div>

      {/* Tab Panel 1: My Listings */}
      {activeTab === 'active' && (
        <div className="pf-tab-panel">
          {activeListings.length === 0 ? (
            <div className="pf-empty-tab">
              <div className="icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="4" y="4" width="16" height="16" rx="1" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </div>
              <h2>No active listings</h2>
              <p>You haven't listed any books for sale yet.</p>
              <Link to="/sell" style={{ marginTop: '10px', display: 'inline-block' }}>
                List a Book
              </Link>
            </div>
          ) : (
            activeListings.map((item) => {
              const thumbnail = item.photoUrls && item.photoUrls.length > 0 ? item.photoUrls[0] : null;
              const meetup = meetupInfoMap[item.id];
              const isEditing = editingPriceId === item.id;

              return (
                <div key={item.id} className="pf-listing-row">
                  <div className="ph">
                    {thumbnail ? (
                      <img src={thumbnail} alt={item.title} />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="4" y="3" width="16" height="18" />
                      </svg>
                    )}
                  </div>
                  <div className="pf-listing-info">
                    <div className="pf-listing-badges">
                      <span className={`pf-badge ${item.status === 'reserved' ? 'reserved' : 'available'}`}>
                        {item.status === 'reserved' ? 'Reserved' : 'Available'}
                      </span>
                      <ConditionBadge conditionKey={item.condition} />
                    </div>
                    <div className="pf-listing-title">{item.title}</div>
                    <div className="pf-listing-author">{item.author}</div>
                    <div className="pf-listing-price">
                      ₹{item.price} {item.mrp && <span className="mrp">₹{item.mrp}</span>}
                    </div>

                    {item.status === 'reserved' && (
                      <div className="pf-listing-sub">
                        {meetup ? `Meetup proposed · ${meetup.location}, ${meetup.time}` : 'Meetup in progress'}
                      </div>
                    )}

                    {isEditing ? (
                      <div className="pf-price-edit-form">
                        <input
                          type="number"
                          className="pf-price-edit-input"
                          value={editPriceVal}
                          onChange={(e) => setEditPriceVal(e.target.value)}
                          placeholder="New ₹"
                        />
                        <button onClick={() => handleSavePrice(item)} style={{ background: 'var(--teal)', color: '#fff' }}>
                          Save
                        </button>
                        <button onClick={handleCancelEditPrice}>Cancel</button>
                        {editPriceErr && <span style={{ color: 'var(--danger)', fontSize: '10px', width: '100%' }}>{editPriceErr}</span>}
                      </div>
                    ) : (
                      <div className="pf-listing-actions">
                        {item.status === 'available' ? (
                          <>
                            <button onClick={() => handleStartEditPrice(item)}>Edit Price</button>
                            <button className="primary" onClick={() => handleMarkAsSold(item.id)}>
                              Mark as Sold
                            </button>
                          </>
                        ) : (
                          <>
                            {meetup?.conversationId && (
                              <button onClick={() => navigate(`/chat/${meetup.conversationId}`)}>
                                Chat with Buyer
                              </button>
                            )}
                            <button className="teal" onClick={() => handleMarkAsSold(item.id, meetup?.buyerId)}>
                              Confirm Handover
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab Panel 2: Sold History */}
      {activeTab === 'sold' && (
        <div className="pf-tab-panel">
          {soldListings.length === 0 ? (
            <div className="pf-empty-tab">
              <div className="icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                </svg>
              </div>
              <h2>No sales yet</h2>
              <p>Once a book you've listed is marked sold, it'll show up here.</p>
            </div>
          ) : (
            soldListings.map((item) => {
              const thumbnail = item.photoUrls && item.photoUrls.length > 0 ? item.photoUrls[0] : null;

              return (
                <div key={item.id} className="pf-listing-row">
                  <div className="ph">
                    {thumbnail ? (
                      <img src={thumbnail} alt={item.title} />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="4" y="3" width="16" height="18" />
                      </svg>
                    )}
                  </div>
                  <div className="pf-listing-info">
                    <div className="pf-listing-badges">
                      <span className="pf-badge sold">Sold</span>
                      <ConditionBadge conditionKey={item.condition} />
                    </div>
                    <div className="pf-listing-title">{item.title}</div>
                    <div className="pf-listing-author">{item.author}</div>
                    <div className="pf-listing-price">
                      ₹{item.price} {item.mrp && <span className="mrp">₹{item.mrp}</span>}
                    </div>
                    {item.buyerName && <div className="pf-listing-sub">Sold to {item.buyerName}</div>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab Panel 3: Books I Bought */}
      {activeTab === 'bought' && (
        <div className="pf-tab-panel">
          {purchasedListings.length === 0 ? (
            <div className="pf-empty-tab">
              <div className="icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h2>No purchases yet</h2>
              <p>Books you purchase through Vaasi meetups will appear here.</p>
              <Link to="/" style={{ marginTop: '10px', display: 'inline-block' }}>
                Explore Shelf
              </Link>
            </div>
          ) : (
            purchasedListings.map((item) => {
              const thumbnail = item.photoUrls && item.photoUrls.length > 0 ? item.photoUrls[0] : null;

              return (
                <div key={item.id} className="pf-listing-row">
                  <div className="ph">
                    {thumbnail ? (
                      <img src={thumbnail} alt={item.title} />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="4" y="3" width="16" height="18" />
                      </svg>
                    )}
                  </div>
                  <div className="pf-listing-info">
                    <div className="pf-listing-badges">
                      <span className="pf-badge sold">Purchased</span>
                    </div>
                    <div className="pf-listing-title">{item.title}</div>
                    <div className="pf-listing-author">{item.author}</div>
                    <div className="pf-listing-price">
                      ₹{item.price} {item.mrp && <span className="mrp">₹{item.mrp}</span>}
                    </div>
                    <div className="pf-listing-sub">
                      from {item.sellerName || 'Seller'} · {item.locality || 'Peelamedu'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </main>
  );
}
