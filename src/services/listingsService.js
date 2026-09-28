import { MOCK_LISTINGS } from '../data/mockData';

const DELAY_MS = 350;

/**
 * Fetch all available book listings.
 * 
 * Firebase implementation plan:
 * Will query Firestore collection 'listings' filtered where status == 'available'
 * ordered by createdAt desc with pagination.
 */
export async function getListings() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_LISTINGS]);
    }, DELAY_MS);
  });
}

/**
 * Fetch a single listing by its ID.
 * 
 * Firebase implementation plan:
 * Will fetch document doc(db, 'listings', id) from Firestore.
 */
export async function getListingById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = MOCK_LISTINGS.find((l) => l.id === id);
      if (item) resolve({ ...item });
      else reject(new Error(`Listing ${id} not found`));
    }, DELAY_MS);
  });
}

/**
 * Create a new secondhand book listing.
 * 
 * Firebase implementation plan:
 * Will call addDoc(collection(db, 'listings'), { ...data, createdAt: serverTimestamp() }).
 */
export async function createListing(listingData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newListing = {
        id: `b_${Date.now()}`,
        ...listingData,
        status: 'available',
        createdAt: new Date().toISOString()
      };
      MOCK_LISTINGS.unshift(newListing);
      resolve(newListing);
    }, DELAY_MS);
  });
}

/**
 * Mark a listing as sold.
 * 
 * Firebase implementation plan:
 * Will call updateDoc(doc(db, 'listings', id), { status: 'sold' }).
 */
export async function markSold(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const target = MOCK_LISTINGS.find((l) => l.id === id);
      if (target) target.status = 'sold';
      resolve(target);
    }, DELAY_MS);
  });
}
