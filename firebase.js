import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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

// Initialize Firebase Auth with AsyncStorage persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

console.log('🔥 Firebase initialized with AsyncStorage persistence for React Native');

export default app;
