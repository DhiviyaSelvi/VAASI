import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useListings } from '../hooks/useListings';
import ShelfRow from '../components/books/ShelfRow';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export default function Browse() {
  const { listings, loading, error, refetch, toggleForceError, isForcedError } = useListings();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState(null);

  // Filter chips definitions
  const CHIPS = [
    { id: 'under150', label: 'Under ₹150' },
    { id: 'likeNew', label: 'Like New' },
    { id: 'textbooks', label: 'College Textbooks' }
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
      }

      return true;
    });
  }, [listings, searchQuery, activeChip]);

  // Group listings into specified shelves
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

  // Fallback "More Books" shelf for unmapped/other categories
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
    <div className="browse-page">
      {/* Dev Mode Debug Error Toggle */}
      {import.meta.env.DEV && (
        <div style={{ marginBottom: 'var(--space-sm)', textAlign: 'right' }}>
          <button
            onClick={toggleForceError}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              backgroundColor: isForcedError ? 'red' : 'var(--color-quiet-grey)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            {isForcedError ? '⚡ Simulated Error Active (Click to Clear)' : '🧪 Simulate Error State'}
          </button>
        </div>
      )}

      {/* 1. Search Bar */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search books, authors, semesters (e.g. Engineering Maths)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. Quick Filter Chips */}
      <div className="chips-container">
        {CHIPS.map((chip) => {
          const isActive = activeChip === chip.id;
          return (
            <button
              key={chip.id}
              className={`filter-chip ${isActive ? 'active' : ''}`}
              onClick={() => handleChipClick(chip.id)}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* 3. Bazaar Banner */}
      <div className="bazaar-banner">
        <div className="banner-tag">
          🔒 COIMBATORE BAZAAR
        </div>
        <h2 className="banner-headline">
          New listings added daily from Peelamedu and RS Puram.
        </h2>
        <p className="banner-subtext">
          Direct student-to-student handover
        </p>
        <Link to="/sell" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" className="banner-btn">
            Post Your Old Books
          </Button>
        </Link>
      </div>

      {/* States Handling */}
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
        <div className="shelves-wrapper">
          <ShelfRow
            eyebrow="ENGINEERING • MEDICINE • ARTS"
            title="College Books & Textbooks"
            listings={collegeListings}
          />
          <ShelfRow
            eyebrow="PAPERBACKS & TAMIL PROSE"
            title="Novels & Fiction"
            listings={fictionListings}
          />
          <ShelfRow
            eyebrow="PLACEMENTS & ENTRANCE"
            title="Competitive Exams"
            listings={competitiveListings}
          />
          <ShelfRow
            eyebrow="SELF IMPROVEMENT & INSIGHTS"
            title="Non-Fiction & Self-Help"
            listings={nonFictionListings}
          />
          <ShelfRow
            eyebrow="OTHER GENRES"
            title="More Books"
            listings={moreListings}
          />
        </div>
      )}
    </div>
  );
}
