import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZEwQGgNSAnX9AGjOhzwCuJuc10no6jfs",
  authDomain: "vaasi-coimbatore.firebaseapp.com",
  projectId: "vaasi-coimbatore",
  storageBucket: "vaasi-coimbatore.firebasestorage.app",
  messagingSenderId: "926755043212",
  appId: "1:926755043212:web:d9bc741944ac032aa008a9",
  measurementId: "G-RDHSK91FVM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
