import { MOCK_USER, MOCK_USERS } from '../data/mockData';

const DELAY_MS = 300;
let isSignedInState = false; // Default signed out for testing auth protection

/**
 * Check sync auth state.
 */
export function getCurrentAuthState() {
  return isSignedInState;
}

/**
 * Get currently authenticated user profile.
 * 
 * Firebase implementation plan:
 * Will listen to firebase/auth onAuthStateChanged and fetch matching user doc from Firestore.
 */
export async function getCurrentUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(isSignedInState ? { ...MOCK_USER } : null);
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
 * Sign in user using Google Auth provider.
 * 
 * Firebase implementation plan:
 * Will call signInWithPopup(auth, googleProvider) or signInWithRedirect.
 */
export async function signInWithGoogle() {
  return new Promise((resolve) => {
    setTimeout(() => {
      isSignedInState = true;
      resolve({ ...MOCK_USER });
    }, DELAY_MS);
  });
}

/**
 * Log in user using credentials.
 */
export async function loginUser(credentials) {
  return new Promise((resolve) => {
    setTimeout(() => {
      isSignedInState = true;
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
      isSignedInState = false;
      resolve(true);
    }, DELAY_MS);
  });
}
