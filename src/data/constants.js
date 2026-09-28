/**
 * @typedef {'like_new' | 'good' | 'fair' | 'well_read'} BookCondition
 * @typedef {'available' | 'reserved' | 'sold'} ListingStatus
 * 
 * @typedef {Object} Listing
 * @property {string} id
 * @property {string} title
 * @property {string} author
 * @property {string} publisher
 * @property {string} category
 * @property {BookCondition} condition
 * @property {number} mrp
 * @property {number} price
 * @property {string} description
 * @property {string} locality
 * @property {string[]} photoUrls
 * @property {ListingStatus} status
 * @property {string} sellerId
 * @property {string} sellerName
 * @property {string} createdAt
 * 
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} locality
 * @property {string} college
 * @property {string} memberSince
 * @property {number} ratingAverage
 * @property {number} ratingCount
 * 
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} senderId
 * @property {string} text
 * @property {string} createdAt
 * 
 * @typedef {Object} Conversation
 * @property {string} id
 * @property {string} listingId
 * @property {string[]} participantIds
 * @property {Message[]} messages
 */

export const CONDITIONS = {
  LIKE_NEW: { id: 'like_new', label: 'Like New', color: 'var(--color-condition-like-new)' },
  GOOD: { id: 'good', label: 'Good', color: 'var(--color-condition-good)' },
  FAIR: { id: 'fair', label: 'Fair', color: 'var(--color-condition-fair)' },
  WELL_READ: { id: 'well_read', label: 'Well Read', color: 'var(--color-condition-well-read)' },
};

export const CATEGORIES = [
  'Academic & Textbooks',
  'Engineering & Tech',
  'Fiction & Novels',
  'Non-Fiction & Self-Help',
  'Competitive Exams',
  'Tamil Literature',
  'Children & Young Adult'
];

export const LOCALITIES = [
  'RS Puram',
  'Peelamedu',
  'Gandhipuram',
  'Saibaba Colony',
  'Saravanampatti',
  'Singanallur',
  'Vadavalli',
  'Kovaipudur'
];
