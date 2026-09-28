import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useListings } from '../hooks/useListings';
import ShelfRow from '../components/books/ShelfRow';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export default function Browse() {
  const { listings, loading, error, refetch, toggleForceError, isForcedError } = useListings();
  const [searchQuery, setSearchQuery] = useState('');

  // Feature 1: No filter chip is active by default
  const [activeChip, setActiveChip] = useState(null);

  const CHIPS = [
    { id: 'under150', label: 'Under ₹150' },
    { id: 'likeNew', label: 'Like New' },
    { id: 'textbooks', label: 'College Textbooks' },
    { id: 'tamil', label: 'Tamil Literature' } // Feature 4: Tamil Literature chip
  ];

  const handleChipClick = (chipId) => {
    setActiveChip((prev) => (prev === chipId ? null : chipId));
  };

  // Filter listings by search query & active chip
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // 1. Search filter (title or author)
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const titleMatch = item.title?.toLowerCase().includes(q);
        const authorMatch = item.author?.toLowerCase().includes(q);
        if (!titleMatch && !authorMatch) return false;
      }

      // 2. Chip filter
      if (activeChip === 'under150') {
        if (item.price > 150) return false;
      } else if (activeChip === 'likeNew') {
        if (item.condition !== 'like_new') return false;
      } else if (activeChip === 'textbooks') {
        if (item.category !== 'Academic & Textbooks' && item.category !== 'Engineering & Tech') return false;
      } else if (activeChip === 'tamil') {
        if (item.category !== 'Tamil Literature') return false;
      }

      return true;
    });
  }, [listings, searchQuery, activeChip]);

  // Feature 3: Categorized shelves + Non-Fiction & Self-Help + More Books fallback
  const collegeListings = useMemo(() => {
    return filteredListings.filter(
      (item) => item.category === 'Academic & Textbooks' || item.category === 'Engineering & Tech'
    );
  }, [filteredListings]);

  const fictionListings = useMemo(() => {
    return filteredListings.filter(
      (item) => item.category === 'Fiction & Novels' || item.category === 'Tamil Literature'
    );
  }, [filteredListings]);

  const competitiveListings = useMemo(() => {
    return filteredListings.filter((item) => item.category === 'Competitive Exams');
  }, [filteredListings]);

  const nonFictionListings = useMemo(() => {
    return filteredListings.filter((item) => item.category === 'Non-Fiction & Self-Help');
  }, [filteredListings]);

  // Fallback "More Books" shelf for any unmapped category so no book disappears
  const mappedIds = useMemo(() => {
    const ids = new Set();
    [...collegeListings, ...fictionListings, ...competitiveListings, ...nonFictionListings].forEach((item) => {
      ids.add(item.id);
    });
    return ids;
  }, [collegeListings, fictionListings, competitiveListings, nonFictionListings]);

  const moreListings = useMemo(() => {
    return filteredListings.filter((item) => !mappedIds.has(item.id));
  }, [filteredListings, mappedIds]);

  return (
    <div className="wrap">
      {/* Dev Mode Debug Error Toggle */}
      {import.meta.env.DEV && (
        <div style={{ margin: '8px 0', textAlign: 'right' }}>
          <button
            onClick={toggleForceError}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: '700',
              backgroundColor: isForcedError ? '#EF4444' : 'var(--ink-quiet)',
              color: 'white',
              border: '1.5px solid var(--ink)',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            {isForcedError ? '⚡ Simulated Error Active (Click to Clear)' : '🧪 Simulate Error State'}
          </button>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          type="search"
          placeholder="Search books, authors, semesters (e.g. Engineering Maths)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery ? (
          <button className="filter-btn" onClick={() => setSearchQuery('')} aria-label="Clear Search">
            ✕
          </button>
        ) : (
          <button className="filter-btn" aria-label="Filters">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
              <circle cx="16" cy="7" r="2" />
              <circle cx="8" cy="17" r="2" />
            </svg>
          </button>
        )}
      </div>

      {/* FILTER CHIPS */}
      <div className="chips">
        {CHIPS.map((chip) => {
          const isActive = activeChip === chip.id;
          return (
            <button
              key={chip.id}
              className={`chip ${isActive ? 'active' : ''}`}
              onClick={() => handleChipClick(chip.id)}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* BAZAAR BANNER */}
      <section className="banner">
        <span className="banner-tag">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M3 10l9-6 9 6v10H3z" />
          </svg>
          COIMBATORE BAZAAR LIVE
        </span>
        <h2>New listings added daily from Peelamedu and RS Puram.</h2>
        <p className="banner-places">PSG Tech • CIT • Peelamedu • R.S. Puram Pavements</p>

        <div className="book-stack" aria-hidden="true">
          <div className="stack-book sb1">Sapiens<span className="price">₹180</span></div>
          <div className="stack-book sb2">HIGHER ENGG<br />B.S. GREWAL<span className="price">₹280</span></div>
          <div className="stack-book sb3">பொன்னியின் செல்வன்<span className="price">₹450</span></div>
          <div className="stack-book sb4">PHYSICS<br />H.C. Verma<span className="price">₹320</span></div>
        </div>

        <div className="banner-foot">
          <span>Direct student-to-student handover</span>
          <Link to="/sell" style={{ textDecoration: 'none' }}>
            <button className="banner-btn">Post Your Old Books</button>
          </Link>
        </div>
      </section>

      {/* STATES HANDLING */}
      {loading && (
        <div className="skeleton-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-author"></div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="error-container">
          <p className="error-message">⚠️ {error}</p>
          <Button variant="primary" onClick={refetch}>
            Try again
          </Button>
        </div>
      )}

      {!loading && !error && filteredListings.length === 0 && (
        <EmptyState
          title="No books match yet"
          message="No books match your current search or filters. Try a different search, or list one yourself."
        />
      )}

      {!loading && !error && filteredListings.length > 0 && (
        <>
          <ShelfRow
            eyebrow="Engineering • Medicine • Arts"
            title="College Books & Textbooks"
            listings={collegeListings}
          />
          <ShelfRow
            eyebrow="Paperbacks & Tamil Prose"
            title="Novels & Fiction"
            listings={fictionListings}
          />
          <ShelfRow
            eyebrow="Placements & Entrance"
            title="Competitive Exams"
            listings={competitiveListings}
          />
          <ShelfRow
            eyebrow="Self Improvement & Insights"
            title="Non-Fiction & Self-Help"
            listings={nonFictionListings}
          />
          <ShelfRow
            eyebrow="Other Genres"
            title="More Books"
            listings={moreListings}
          />
        </>
      )}
    </div>
  );
}
