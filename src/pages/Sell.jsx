import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONDITIONS, LOCALITIES } from '../data/constants';
import { suggestPrice, checkPrice, PRICING } from '../utils/pricing';
import { createListing } from '../services/listingsService';
import '../styles/sell.css';

const CATEGORIES = [
  'College Textbooks',
  'School (Samacheer/CBSE)',
  'Competitive Exams (GATE/UPSC)',
  'Fiction/Novels',
  'Rare & Vintage'
];

export default function Sell() {
  const navigate = useNavigate();

  // Form State
  const [photos, setPhotos] = useState([]); // [{ file, url, type }]
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isOlderEdition, setIsOlderEdition] = useState(false);
  const [condition, setCondition] = useState('good');
  const [mrp, setMrp] = useState('');
  const [price, setPrice] = useState('');
  const [locality, setLocality] = useState(LOCALITIES[0]);
  const [description, setDescription] = useState('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [formError, setFormError] = useState('');

  // Category switch listener for older-edition support
  const supportsOlderEdition = category === 'College Textbooks' || category === 'Competitive Exams (GATE/UPSC)';

  const handleCategorySelect = (cat) => {
    setIsDirty(true);
    setCategory(cat);
    if (cat !== 'College Textbooks' && cat !== 'Competitive Exams (GATE/UPSC)') {
      setIsOlderEdition(false);
    }
  };

  // Image Upload Handler
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (photos.length + files.length > 5) {
      alert('You can upload a maximum of 5 photos.');
      return;
    }

    const newPhotos = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 5MB limit.`);
        continue;
      }
      const url = URL.createObjectURL(file);
      newPhotos.push({ file, url, id: Math.random().toString(36).substring(2, 9) });
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
    setIsDirty(true);
  };

  const handleRemovePhoto = (id) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target && target.url) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((p) => p.id !== id);
    });
    setIsDirty(true);
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach((p) => {
        if (p.url) URL.revokeObjectURL(p.url);
      });
    };
  }, []);

  // BeforeUnload unsaved prompt
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Derived Pricing Calculations
  const mrpNum = parseFloat(mrp) || 0;
  const priceNum = parseFloat(price) || 0;

  const suggestion = suggestPrice(mrpNum, condition, isOlderEdition, category);
  const validation = checkPrice(price, mrpNum, category);

  const handleApplySuggested = (val) => {
    setPrice(val.toString());
    setIsDirty(true);
  };

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to exit?')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a book title.');
      return;
    }
    if (!author.trim()) {
      setFormError('Please enter author or publication name.');
      return;
    }
    if (!validation.valid) {
      setFormError(validation.error);
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock photoUrls - use uploaded object URLs or fallbacks
      const photoUrls = photos.length > 0 
        ? photos.map((p) => p.url) 
        : ['/sample-book-1.svg'];

      const listingData = {
        title: title.trim(),
        author: author.trim(),
        publisher: author.trim(),
        category,
        condition,
        mrp: mrpNum || priceNum * 2,
        price: priceNum,
        description: description.trim() || `${title} in ${condition} condition.`,
        locality,
        photoUrls,
        sellerId: 'u_current',
        sellerName: 'Dhiviya Selvi',
      };

      const newListing = await createListing(listingData);
      setIsDirty(false);
      navigate('/book/' + newListing.id);
    } catch (err) {
      setFormError(err.message || 'Failed to list book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sl-page">
      <header className="sell-top">
        <button className="icon-btn" onClick={handleClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18"/>
          </svg>
        </button>
        <h1>List a Book for Sale</h1>
        <span className="step-tag">STEP 1 OF 1</span>
      </header>

      <div className="tip-strip">
        <span className="icon-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
            <path d="M13 2L4 14h7l-1 8 9-12h-7z"/>
          </svg>
        </span>
        The more photos you add, the faster your book finds a reader.
      </div>

      <main className="sell-wrap">
        <form onSubmit={handleSubmit}>
          {/* Section 1: Photos */}
          <section className="section">
            <div className="section-head">
              <h2>Book Photos</h2>
              <span className="aside">{photos.length} of 5 uploaded</span>
            </div>

            <label className="upload-box">
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                style={{ display: 'none' }} 
                onChange={handlePhotoUpload}
              />
              <span className="icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
                  <path d="M4 8h3l2-3h6l2 3h3v12H4z"/>
                  <circle cx="12" cy="13" r="3.5"/>
                </svg>
              </span>
              <b>Add Cover &amp; Pages</b>
              <span>Upload front cover, back cover, and an open page showing condition.</span>
            </label>

            {photos.length > 0 && (
              <div className="up-thumbs">
                {photos.map((p, idx) => (
                  <div key={p.id} className="up-thumb">
                    {idx === 0 && <span className="main-tag">MAIN</span>}
                    <div className="up-img">
                      <img src={p.url} alt={`Upload ${idx + 1}`} />
                    </div>
                    <div className="up-label">
                      {idx === 0 ? 'Front' : idx === 1 ? 'Back' : `Page ${idx - 1}`}
                      <button type="button" onClick={() => handleRemovePhoto(p.id)} aria-label="Remove photo">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section 2: Details */}
          <section className="section">
            <div className="section-head">
              <h2>Book Details</h2>
            </div>

            <div className="field">
              <label htmlFor="title">Book Title <span className="req">*</span></label>
              <input 
                id="title"
                className="input" 
                value={title} 
                onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
                placeholder="e.g. Engineering Thermodynamics"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="author">Author / Publication <span className="req">*</span></label>
              <input 
                id="author"
                className="input" 
                value={author} 
                onChange={(e) => { setAuthor(e.target.value); setIsDirty(true); }}
                placeholder="e.g. P.K. Nag, McGraw Hill"
                required
              />
            </div>

            <div className="field">
              <span className="label">Category</span>
              <div className="chips">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`chip ${category === cat ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {supportsOlderEdition && (
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isOlderEdition}
                    onChange={(e) => { setIsOlderEdition(e.target.checked); setIsDirty(true); }}
                  />
                  This is an older edition (suggests ~{Math.round(PRICING.editionDiscountPct * 100)}% below the normal price)
                </label>
              )}
            </div>
          </section>

          {/* Section 3: Condition & Pricing */}
          <section className="section">
            <div className="section-head">
              <h2>Book Condition &amp; Pricing</h2>
              <span className="aside">Select physical state</span>
            </div>

            <div className="field">
              <span className="label">Condition</span>
              <div className="cond-list">
                {Object.values(CONDITIONS).map((c) => (
                  <label key={c.id} className="cond-opt">
                    <input 
                      type="radio" 
                      name="condition" 
                      value={c.id} 
                      checked={condition === c.id}
                      onChange={() => { setCondition(c.id); setIsDirty(true); }}
                    />
                    <div className="cond-top">
                      <span className={`cond-tag t-${c.id}`}>{c.label}</span>
                      <span className="cond-suggest">{c.suggestRange}</span>
                    </div>
                    <div className="cond-desc">{c.desc}</div>
                    <div className="cond-check">✓</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="row2" style={{ marginTop: '16px' }}>
              <div className="field">
                <label htmlFor="mrp">Original MRP (₹)</label>
                <div className="money">
                  <span>₹</span>
                  <input 
                    id="mrp"
                    type="number"
                    className="input" 
                    value={mrp}
                    onChange={(e) => { setMrp(e.target.value); setIsDirty(true); }}
                    placeholder="e.g. 750"
                  />
                </div>
                {category === 'Rare & Vintage' ? (
                  <div className="hint">Rare &amp; Vintage books do not require MRP guidelines.</div>
                ) : (
                  <div className="hint">Original printed price on cover</div>
                )}
              </div>

              <div className="field">
                <label htmlFor="price">Your Selling Price (₹) <span className="req">*</span></label>
                <div className="money">
                  <span>₹</span>
                  <input 
                    id="price"
                    type="number"
                    className="input" 
                    value={price}
                    onChange={(e) => { setPrice(e.target.value); setIsDirty(true); }}
                    placeholder="e.g. 340"
                    required
                  />
                </div>
                <div className="hint">Amount buyer pays at meetup</div>
              </div>
            </div>

            <div className="field" style={{ marginTop: '16px' }}>
              <label htmlFor="locality">Pickup Area <span className="req">*</span></label>
              <select 
                id="locality"
                className="input" 
                value={locality}
                onChange={(e) => { setLocality(e.target.value); setIsDirty(true); }}
                required
              >
                {LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Price Suggestions */}
            {suggestion && category !== 'Rare & Vintage' && (
              <div className="suggest-line">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4M12 8h.01"/>
                </svg>
                {suggestion.approximate
                  ? <>About ₹{suggestion.recommended} (roughly half of MRP) is typical.</>
                  : <>Suggested for {CONDITIONS[condition.toUpperCase()]?.label || condition}: ₹{suggestion.min}–₹{suggestion.max} (Rec: ₹{suggestion.recommended})</>
                }
                <button
                  type="button"
                  style={{ textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', fontWeight: 'bold', cursor: 'pointer', marginLeft: '6px' }}
                  onClick={() => handleApplySuggested(suggestion.recommended)}
                >
                  Use ₹{suggestion.recommended}
                </button>
              </div>
            )}

            {/* Error / Warning Feedbacks */}
            {price && !validation.valid && (
              <div className="error-line">
                ⚠️ {validation.error}
              </div>
            )}
            {price && validation.valid && validation.warning && (
              <div className="warning-line">
                💡 {validation.warning}
              </div>
            )}

            {formError && (
              <div className="error-line" style={{ marginTop: '12px', fontSize: '13px' }}>
                🚨 {formError}
              </div>
            )}

            <div className="field" style={{ marginTop: '16px' }}>
              <label htmlFor="desc">Additional Description (Optional)</label>
              <textarea
                id="desc"
                className="input"
                value={description}
                onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
                placeholder="Mention any specific highlights, included material, or exact meetup preferences..."
              />
            </div>

            <div className="fee-note" style={{ marginTop: '16px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              <span>The book price is paid directly at the meetup, and the ₹15 match fee is separate, charged only when a meetup is confirmed.</span>
            </div>
          </section>

          {/* Fixed Sticky Publish Bar */}
          <div className="publish-bar">
            <div className="payout">
              <small>Your Direct Receive</small>
              <b>₹{priceNum > 0 ? priceNum : '0'}</b>
            </div>
            <button 
              type="submit" 
              className="publish-btn"
              disabled={isSubmitting || (price && !validation.valid)}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
