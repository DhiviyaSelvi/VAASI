import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut as firebaseSignOut 
} from "firebase/auth";
import { auth } from "../firebase";
import { MOCK_USER, MOCK_USERS } from '../data/mockData';

let firebaseUser = null;
let authInitialized = false;
let authListeners = [];

// Listen to real Firebase Auth state changes
onAuthStateChanged(auth, (user) => {
  firebaseUser = user;
  authInitialized = true;
  authListeners.forEach((cb) => cb(user));
});

/**
 * Subscribe to auth state loading/change.
 */
export function subscribeAuthState(callback) {
  authListeners.push(callback);
  if (authInitialized) {
    callback(firebaseUser);
  }
  return () => {
    authListeners = authListeners.filter((cb) => cb !== callback);
  };
}

/**
 * Check sync auth state.
 */
export function getCurrentAuthState() {
  return !!firebaseUser;
}

/**
 * Check if auth state is initialized.
 */
export function isAuthInitialized() {
  return authInitialized;
}

/**
 * Get currently authenticated user profile.
 */
export async function getCurrentUser() {
  if (firebaseUser) {
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'Firebase User',
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
      locality: 'Peelamedu',
      college: 'PSG College of Technology',
      memberSince: new Date().toISOString(),
      ratingAverage: 0,
      ratingCount: 0
    };
  }
  return { ...MOCK_USER };
}

/**
 * Get user profile by user ID.
 */
export async function getUserById(userId) {
  if (firebaseUser && firebaseUser.uid === userId) {
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'Firebase User',
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
      locality: 'Peelamedu',
      college: 'PSG College of Technology',
      memberSince: new Date().toISOString(),
      ratingAverage: 0,
      ratingCount: 0
    };
  }
  const user = MOCK_USERS[userId] || null;
  return user ? { ...user } : null;
}

/**
 * Sign in user using Google Auth provider.
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const popupPromise = signInWithPopup(auth, provider);
  console.timeEnd('[Auth Timing] Click to Popup open');
  const result = await popupPromise;
  const user = result.user;
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL
  };
}

/**
 * Log out user session.
 */
export async function logoutUser() {
  await firebaseSignOut(auth);
  return true;
}

/**
 * Legacy login helper fallback.
 */
export async function loginUser(credentials) {
  return signInWithGoogle();
}
