import { MOCK_USER } from '../data/mockData';

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
