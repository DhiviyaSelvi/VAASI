import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getConversation, sendMessage, confirmMeetup } from '../services/chatService';
import { getListingById } from '../services/listingsService';
import { getUserById } from '../services/authService';
import ConditionBadge from '../components/books/ConditionBadge';
import '../styles/chat.css';

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [listing, setListing] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [inputValue, setInputValue] = useState('');
  
  // Propose Meetup Inline Form state
  const [showProposeForm, setShowProposeForm] = useState(false);
  const [meetupLoc, setMeetupLoc] = useState('Gandhipuram Town Bus Stand, Bay 2');
  const [meetupTime, setMeetupTime] = useState('Tomorrow, 5:15 PM');
  
  // Make Offer Inline Form state
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');

  // Payment mock state
  const [isPaying, setIsPaying] = useState(false);

  const messagesEndRef = useRef(null);
  
  const currentUserId = 'user_101'; // hardcoded for now, same as MOCK_USER.id

  useEffect(() => {
    async function loadData() {
      try {
        const conv = await getConversation(conversationId);
        setConversation(conv);
        setMessages(conv.messages || []);
        
        const otherId = conv.participantIds?.find(id => id !== currentUserId) || conv.participantIds?.[0];
        if (otherId) {
          getUserById(otherId).then(u => setOtherUser(u)).catch(() => null);
        }

        const book = await getListingById(conv.listingId);
        setListing(book);
        if (book?.price) {
          const defaultOffer = Math.round((book.price * 0.9) / 10) * 10;
          setOfferAmount(defaultOffer.toString());
        }
      } catch (err) {
        console.error('Error loading chat:', err);
      } finally {
        setLoading(false);
      }
    }
    if (conversationId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    // Auto-scroll to latest message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');
    
    // Optimistic update
    const tempMsg = {
      id: `temp_${Date.now()}`,
      senderId: currentUserId,
      text,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const realMsg = await sendMessage(conversationId, text);
      setMessages((prev) => prev.map((m) => m.id === tempMsg.id ? realMsg : m));
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleShareLocation = () => {
    const text = "📍 Shared Location Pin: Gandhipuram (Approximate)";
    // Optimistic update
    const tempMsg = {
      id: `temp_loc_${Date.now()}`,
      senderId: currentUserId,
      text,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempMsg]);
    sendMessage(conversationId, text).catch(console.error);
  };

  const handleProposeSubmit = (e) => {
    e.preventDefault();
    if (!meetupLoc.trim() || !meetupTime.trim()) return;
    if (messages.some(m => m.type === 'match' && (m.status === 'proposed' || m.status === 'agreed'))) return;
    
    const proposalMsg = {
      id: `match_${Date.now()}`,
      senderId: currentUserId,
      type: 'match',
      status: 'proposed',
      location: meetupLoc,
      time: meetupTime,
      createdAt: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, proposalMsg]);
    setShowProposeForm(false);
  };

  const handleOfferSubmit = (e) => {
    e.preventDefault();
    const val = parseInt(offerAmount, 10);
    if (isNaN(val) || val <= 0) return;
    if (messages.some(m => m.type === 'offer' && m.status === 'pending')) return;

    const offerMsg = {
      id: `offer_${Date.now()}`,
      senderId: currentUserId,
      type: 'offer',
      amount: val,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, offerMsg]);
    setShowOfferForm(false);
  };

  const handleAcceptOffer = (msgId, amount) => {
    setMessages((prev) => prev.map((m) => 
      m.id === msgId ? { ...m, status: 'accepted' } : m
    ));
    if (listing) {
      setListing(prev => prev ? { ...prev, price: amount } : prev);
    }
  };

  // ⚠️ TEMP/DEV-ONLY: Simulate the other person accepting an offer
  const simulateOtherAcceptsOffer = (msgId, amount) => {
    handleAcceptOffer(msgId, amount);
  };

  const hasActiveMatch = messages.some(m => m.type === 'match' && (m.status === 'proposed' || m.status === 'agreed' || m.status === 'paid'));
  const hasPendingOffer = messages.some(m => m.type === 'offer' && m.status === 'pending');

  // ⚠️ TEMP/DEV-ONLY: Simulate the other person agreeing to the meetup
  const simulateOtherAgrees = (msgId) => {
    setMessages((prev) => prev.map((m) => 
      m.id === msgId ? { ...m, status: 'agreed' } : m
    ));
  };

  const handlePayFee = async (msgId) => {
    setIsPaying(true);
    try {
      await confirmMeetup(conversationId);
      setMessages((prev) => prev.map((m) => 
        m.id === msgId ? { ...m, status: 'paid' } : m
      ));
    } catch (err) {
      console.error('Payment failed', err);
    } finally {
      setIsPaying(false);
    }
  };

  if (!conversationId) {
    return <div className="ch-page"><div className="ch-body">Please select a conversation from your Profile or messages view.</div></div>;
  }

  if (loading) {
    return <div className="ch-page"><div className="ch-body" style={{justifyContent: 'center', display: 'flex'}}>Loading...</div></div>;
  }

  if (!conversation) {
    return <div className="ch-page"><div className="ch-body">Conversation not found.</div></div>;
  }

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const thumbnail = listing?.photoUrls && listing.photoUrls.length > 0 ? listing.photoUrls[0] : null;
  const hasDiscount = listing?.mrp && listing?.price && listing.mrp > listing.price;
  const percentOff = hasDiscount ? Math.round(((listing.mrp - listing.price) / listing.mrp) * 100) : 0;
  
  const otherName = otherUser?.name || 'Seller';
  const otherCollege = otherUser?.college || listing?.locality || 'Peelamedu';
  const otherInitials = otherName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="ch-page">
      {/* Header Bar with Seller Profile */}
      <header className="ch-top">
        <button className="ch-icon-btn" aria-label="Back" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
        </button>
        <div className="ch-seller-bar">
          <div className="ch-seller-avatar">{otherInitials}</div>
          <div className="ch-seller-info">
            <div className="ch-seller-name">
              {otherName}
              {otherUser?.collegeEmailVerified && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{display: 'inline', marginLeft: '4px', verticalAlign: 'middle'}}>
                  <circle cx="12" cy="12" r="10" fill="#0F5148" />
                  <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div className="ch-seller-sub">
              {otherUser?.collegeEmailVerified && <span className="ch-email-tag">College Email Verified</span>}
              <span className="ch-locality">{otherCollege}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mini Listing Preview Card */}
      {listing && (
        <div className="ch-preview-card-wrap">
          <div className="ch-preview-card">
            <div className="ch-preview-thumb">
              {thumbnail ? (
                <img src={thumbnail} alt={listing.title} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="3" width="16" height="18"/></svg>
              )}
            </div>
            
            <div className="ch-preview-details">
              <div className="ch-preview-row1">
                <ConditionBadge conditionKey={listing.condition} />
                <span className={`ch-status-pill ${listing.status === 'sold' ? 'sold' : listing.status === 'reserved' ? 'reserved' : ''}`}>
                  {listing.status === 'sold' ? 'Sold' : listing.status === 'reserved' ? 'Reserved' : 'Available'}
                </span>
              </div>
              
              <div className="ch-preview-title">{listing.title}</div>
              
              <div className="ch-preview-price-row">
                <span className="ch-price-bold">₹{listing.price}</span>
                {listing.mrp && listing.mrp > listing.price && <s className="ch-mrp-strike">₹{listing.mrp}</s>}
                {hasDiscount && <span className="ch-off-tag">({percentOff}% off)</span>}
              </div>
            </div>

            <div className="ch-preview-action">
              <Link to={`/book/${listing.id}`} className="ch-view-listing-btn">
                View Listing
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Message List */}
      <div className="ch-body">
        {messages.length === 0 ? (
          <div className="ch-empty">
            <div className="ch-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </div>
            <h2>No messages yet</h2>
            <p>Say hi to start the conversation.</p>
          </div>
        ) : (
          <>
            <div className="ch-day-chip"><span>Today{listing?.locality ? ` · ${listing.locality} Zone` : ''}</span></div>
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              
              if (msg.type === 'offer') {
                return (
                  <div key={msg.id} className="ch-offer-card">
                    <div className="ch-offer-head">
                      <span className="ch-offer-label">🏷️ Price Offer</span>
                      {msg.status === 'pending' && <span className="ch-offer-badge pending">Pending</span>}
                      {msg.status === 'accepted' && <span className="ch-offer-badge accepted">Accepted</span>}
                    </div>

                    <div className="ch-offer-amount">
                      Offer: <b>₹{msg.amount}</b>
                    </div>

                    {msg.status === 'pending' && !isMe && (
                      <button 
                        className="ch-accept-btn"
                        onClick={() => handleAcceptOffer(msg.id, msg.amount)}
                      >
                        Accept Offer
                      </button>
                    )}

                    {msg.status === 'pending' && isMe && (
                      <div className="ch-offer-note">
                        Offer sent to seller. Waiting for response...
                      </div>
                    )}

                    {/* ⚠️ TEMP/DEV-ONLY BUTTON */}
                    {msg.status === 'pending' && (
                      <button 
                        onClick={() => simulateOtherAcceptsOffer(msg.id, msg.amount)}
                        className="ch-dev-btn"
                      >
                        Simulate: other person accepts (Dev Only)
                      </button>
                    )}
                  </div>
                );
              }

              if (msg.type === 'match') {
                return (
                  <div key={msg.id} className="ch-match-card">
                    <div className="ch-match-head">
                      <span className="ch-match-label">🤝 Confirm Match</span>
                      {msg.status === 'proposed' && <span className="ch-match-badge" style={{borderColor: 'var(--marigold)', color: '#9A6600', backgroundColor: 'var(--marigold-tint)'}}>Proposed</span>}
                      {msg.status === 'agreed' && <span className="ch-match-badge agreed">Agreed</span>}
                      {msg.status === 'paid' && <span className="ch-match-badge agreed">Locked</span>}
                    </div>
                    
                    <div className="ch-match-loc">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>
                      <span>{msg.location} · {msg.time}</span>
                    </div>

                    {msg.status === 'proposed' && (
                      <div style={{fontSize: '11px', color: 'var(--ink-quiet)', marginBottom: '10px'}}>
                        Waiting for the other person to agree to this time and location...
                      </div>
                    )}
                    
                    {/* ⚠️ TEMP/DEV-ONLY BUTTON */}
                    {msg.status === 'proposed' && (
                      <button 
                        onClick={() => simulateOtherAgrees(msg.id)}
                        className="ch-dev-btn"
                      >
                        Simulate: other person agrees (Dev Only)
                      </button>
                    )}

                    {(msg.status === 'agreed' || msg.status === 'paid') && (
                      <div className="ch-fee-box">
                        <div className="ch-fee-row"><span className="ch-fee-k">Book price (paid in person)</span><span className="ch-fee-v">₹{listing?.price ?? ''}</span></div>
                        <div className="ch-fee-row"><span className="ch-fee-k">Platform match fee</span><span className="ch-fee-v">₹15</span></div>
                        <p className="ch-fee-note">The ₹{listing?.price ?? ''} is settled directly between you and the buyer at the meetup. Only the ₹15 match fee is paid through Vaasi, and it confirms the meetup slot for both of you.</p>
                      </div>
                    )}

                    {(msg.status === 'agreed' || msg.status === 'paid') && (
                      <button 
                        className={`ch-pay-btn ${msg.status === 'paid' ? 'paid' : ''}`}
                        disabled={msg.status === 'paid' || isPaying}
                        onClick={() => handlePayFee(msg.id)}
                      >
                        {isPaying ? 'Processing...' : msg.status === 'paid' ? '✅ Meetup Locked' : '🔒 Pay ₹15 to Lock This Meetup'}
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`ch-msg-row ${isMe ? 'me' : 'them'}`}>
                  <div className="ch-bubble">
                    {msg.text}
                    <span className="ch-msg-time">{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Propose Meetup Form */}
      {showProposeForm && (
        <div style={{padding: '14px', background: 'var(--paper)', borderTop: '2px solid var(--ink)'}}>
          <form onSubmit={handleProposeSubmit} style={{display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '640px', margin: '0 auto'}}>
            <div style={{fontWeight: '700', fontSize: '13px'}}>Propose a Meetup</div>
            <input 
              type="text" 
              placeholder="Location (e.g. PSG Tech Gate)" 
              value={meetupLoc} 
              onChange={(e) => setMeetupLoc(e.target.value)}
              style={{padding: '8px', border: '1.5px solid var(--ink)', outline: 'none', fontFamily: 'inherit'}}
              required
            />
            <input 
              type="text" 
              placeholder="Time (e.g. Tomorrow 5 PM)" 
              value={meetupTime} 
              onChange={(e) => setMeetupTime(e.target.value)}
              style={{padding: '8px', border: '1.5px solid var(--ink)', outline: 'none', fontFamily: 'inherit'}}
              required
            />
            <div style={{display: 'flex', gap: '8px'}}>
              <button type="submit" style={{flex: 1, padding: '8px', background: 'var(--teal)', color: '#fff', border: '1.5px solid var(--ink)', fontWeight: 'bold'}}>Propose</button>
              <button type="button" onClick={() => setShowProposeForm(false)} style={{flex: 1, padding: '8px', background: 'var(--surface)', border: '1.5px solid var(--ink)', fontWeight: 'bold'}}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Make Offer Form */}
      {showOfferForm && (
        <div style={{padding: '14px', background: 'var(--paper)', borderTop: '2px solid var(--ink)'}}>
          <form onSubmit={handleOfferSubmit} style={{display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '640px', margin: '0 auto'}}>
            <div style={{fontWeight: '700', fontSize: '13px'}}>Make an Offer (₹)</div>
            <input 
              type="number" 
              placeholder="Offer Amount in ₹" 
              value={offerAmount} 
              onChange={(e) => setOfferAmount(e.target.value)}
              style={{padding: '8px', border: '1.5px solid var(--ink)', outline: 'none', fontFamily: 'inherit'}}
              required
              min="1"
            />
            <div style={{display: 'flex', gap: '8px'}}>
              <button type="submit" style={{flex: 1, padding: '8px', background: 'var(--teal)', color: '#fff', border: '1.5px solid var(--ink)', fontWeight: 'bold'}}>Send Offer</button>
              <button type="button" onClick={() => setShowOfferForm(false)} style={{flex: 1, padding: '8px', background: 'var(--surface)', border: '1.5px solid var(--ink)', fontWeight: 'bold'}}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Actions */}
      {!showProposeForm && !showOfferForm && (
        <div className="ch-quick-row">
          <button className="ch-quick-btn" onClick={handleShareLocation}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>
            Share Location Pin
          </button>
          {!hasPendingOffer && (
            <button className="ch-quick-btn" onClick={() => setShowOfferForm(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              Make an Offer
            </button>
          )}
          {!hasActiveMatch && (
            <button className="ch-quick-btn" onClick={() => setShowProposeForm(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>
              Propose Meetup
            </button>
          )}
        </div>
      )}

      {/* Composer */}
      <div className="ch-composer">
        <form onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Type a message…" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="ch-send-btn" type="submit" aria-label="Send" disabled={!inputValue.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
