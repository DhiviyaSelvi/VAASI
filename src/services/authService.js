import { MOCK_USER, MOCK_USERS } from '../data/mockData';

const DELAY_MS = 300;

/**
 * Get currently authenticated user profile.
 * 
 * Firebase implementation plan:
 * Will listen to firebase/auth onAuthStateChanged and fetch matching user doc from Firestore.
 */
export async function getCurrentUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...MOCK_USER });
    }, DELAY_MS);
  });
}

/**
 * Get user profile by user ID.
 * 
 * Firebase implementation plan:
 * Will fetch doc(db, 'users', userId) from Firestore.
 */
export async function getUserById(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = MOCK_USERS[userId] || null;
      resolve(user ? { ...user } : null);
    }, DELAY_MS);
  });
}

/**
 * Log in user using OTP or Firebase Auth provider.
 * 
 * Firebase implementation plan:
 * Will trigger signInWithPhoneNumber or signInWithPopup(auth, provider).
 */
export async function loginUser(credentials) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...MOCK_USER, ...credentials });
    }, DELAY_MS);
  });
}

/**
 * Log out user session.
 * 
 * Firebase implementation plan:
 * Will call signOut(auth).
 */
export async function logoutUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, DELAY_MS);
  });
}
