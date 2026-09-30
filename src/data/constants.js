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

import { PRICING } from '../utils/pricing.js';

export const CONDITIONS = {
  LIKE_NEW: { id: 'like_new', label: PRICING.ranges.like_new.label, suggestRange: `Suggest: ${PRICING.ranges.like_new.range} of MRP`, desc: 'No highlights, no name, crisp pages, undamaged spine.', color: 'var(--color-condition-like-new)' },
  GOOD: { id: 'good', label: PRICING.ranges.good.label, suggestRange: `Suggest: ${PRICING.ranges.good.range} of MRP`, desc: 'Minor corner wear, neat pencil notes allowed.', color: 'var(--color-condition-good)' },
  FAIR: { id: 'fair', label: PRICING.ranges.fair.label, suggestRange: `Suggest: ${PRICING.ranges.fair.range} of MRP`, desc: 'Visible wear, yellowing pages, some highlighting.', color: 'var(--color-condition-fair)' },
  WELL_READ: { id: 'well_read', label: PRICING.ranges.well_read.label, suggestRange: `Suggest: ${PRICING.ranges.well_read.range} of MRP`, desc: 'Cover creased, extensive reading marks, 100% readable.', color: 'var(--color-condition-well-read)' },
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
