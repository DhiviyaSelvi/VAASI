import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { MOCK_LISTINGS } from "../data/mockData.js";

const COLLECTION_NAME = "listings";

/**
 * Format a Firestore document snapshot into the standard listing object shape.
 */
function formatDoc(snap) {
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    // Convert serverTimestamp to ISO string if needed
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
  };
}

/**
 * Fetch all available book listings (from Firestore, fallback to MOCK_LISTINGS if empty).
 */
export async function getListings() {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnap = await getDocs(q);
    
    if (querySnap.empty) {
      // Return seed data if collection is empty
      return [...MOCK_LISTINGS];
    }
    
    return querySnap.docs.map((docSnap) => formatDoc(docSnap));
  } catch (err) {
    console.warn("Firestore getListings fallback to mock:", err);
    return [...MOCK_LISTINGS];
  }
}

/**
 * Fetch a single listing by its Firestore doc ID (or fallback to mock).
 */
export async function getListingById(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return formatDoc(docSnap);
    }
  } catch (err) {
    console.warn(`Firestore getListingById(${id}) fallback:`, err);
  }
  
  // Fallback to mock data if doc ID is a mock ID (e.g. 'b1', 'b2')
  const item = MOCK_LISTINGS.find((l) => l.id === id);
  if (item) return { ...item };
  throw new Error(`Listing ${id} not found`);
}

/**
 * Create a new secondhand book listing in Firestore.
 */
export async function createListing(listingData) {
  const currentUser = auth.currentUser;
  const sellerId = currentUser ? currentUser.uid : "user_101";
  const sellerName = currentUser ? (currentUser.displayName || currentUser.email) : "Seller";

  const payload = {
    ...listingData,
    status: "available",
    sellerId,
    sellerName,
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
  const createdSnap = await getDoc(docRef);
  return formatDoc(createdSnap);
}

/**
 * Fetch listings by seller ID from Firestore.
 */
export async function getListingsBySeller(sellerId) {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("sellerId", "==", sellerId));
    const querySnap = await getDocs(q);
    const firestoreItems = querySnap.docs.map((docSnap) => formatDoc(docSnap));
    
    // Merge mock items if seller is a mock user
    const mockItems = MOCK_LISTINGS.filter((l) => l.sellerId === sellerId);
    return [...firestoreItems, ...mockItems];
  } catch (err) {
    console.warn("Firestore getListingsBySeller fallback:", err);
    return MOCK_LISTINGS.filter((l) => l.sellerId === sellerId);
  }
}

/**
 * Fetch purchased listings by buyer ID from Firestore.
 */
export async function getPurchasedListings(buyerId) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("buyerId", "==", buyerId), 
      where("status", "==", "sold")
    );
    const querySnap = await getDocs(q);
    const firestoreItems = querySnap.docs.map((docSnap) => formatDoc(docSnap));
    
    const mockItems = MOCK_LISTINGS.filter((l) => l.buyerId === buyerId && l.status === "sold");
    return [...firestoreItems, ...mockItems];
  } catch (err) {
    console.warn("Firestore getPurchasedListings fallback:", err);
    return MOCK_LISTINGS.filter((l) => l.buyerId === buyerId && l.status === "sold");
  }
}

/**
 * Update a listing's price in Firestore.
 */
export async function updateListingPrice(id, newPrice) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { price: newPrice });
    const updatedSnap = await getDoc(docRef);
    if (updatedSnap.exists()) {
      return formatDoc(updatedSnap);
    }
  } catch (err) {
    console.warn("Firestore updateListingPrice fallback:", err);
  }

  // Fallback for mock listings
  const target = MOCK_LISTINGS.find((l) => l.id === id);
  if (target) {
    target.price = newPrice;
    return { ...target };
  }
  throw new Error(`Listing ${id} not found`);
}

/**
 * Mark a listing as sold in Firestore.
 */
export async function markSold(id, buyerId) {
  const payload = { status: "sold" };
  if (buyerId) {
    payload.buyerId = buyerId;
  } else {
    payload.buyerId = "user_102";
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, payload);
    const updatedSnap = await getDoc(docRef);
    if (updatedSnap.exists()) {
      return formatDoc(updatedSnap);
    }
  } catch (err) {
    console.warn("Firestore markSold fallback:", err);
  }

  // Fallback for mock listings
  const target = MOCK_LISTINGS.find((l) => l.id === id);
  if (target) {
    target.status = "sold";
    target.buyerId = payload.buyerId;
    return { ...target };
  }
  return null;
}
