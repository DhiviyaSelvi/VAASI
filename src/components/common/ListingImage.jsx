import React, { useState, useEffect } from 'react';

/**
 * Check if a URL string is valid and non-empty.
 */
function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return false;
  return true;
}

/**
 * ListingImage Component
 * Renders a book listing image with automatic onError fallback to a styled teal cover.
 * - `alt=""` on <img> prevents native browser broken image icons and alt text from rendering.
 * - `compact={true}` renders only the centered book icon on a teal background (no title text).
 */
export default function ListingImage({ 
  src, 
  alt = '', 
  title = '', 
  className = '', 
  style = {}, 
  fallbackIconSize = 20,
  compact = false
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const hasValidSrc = isValidImageUrl(src);

  if (!hasValidSrc || imgError) {
    return (
      <div 
        className={`listing-img-placeholder ${compact ? 'compact' : ''} ${className}`} 
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--teal)',
          color: '#FFFFFF',
          padding: compact ? '2px' : '6px',
          boxSizing: 'border-box',
          textAlign: 'center',
          overflow: 'hidden',
          ...style
        }} 
        title={title || 'Book cover'}
      >
        <svg 
          width={fallbackIconSize} 
          height={fallbackIconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        {!compact && title && (
          <span 
            className="placeholder-title"
            style={{
              fontSize: '10px',
              fontWeight: '700',
              marginTop: '4px',
              lineHeight: '1.2',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {title}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        ...style
      }}
      onError={() => setImgError(true)}
    />
  );
}
