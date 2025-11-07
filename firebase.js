import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJ4w2iJmS0F40aOZlS8Svcvp6CO-immmw",
  authDomain: "wishlistai.firebaseapp.com",
  projectId: "wishlistai",
  storageBucket: "wishlistai.firebasestorage.app",
  messagingSenderId: "214343733471",
  appId: "1:214343733471:web:56bf42c4297abf5759d96a",
  measurementId: "G-WWHM3MHBHT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
