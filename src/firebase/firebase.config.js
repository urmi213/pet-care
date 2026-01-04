// firebase/firebase.config.js - WORKING VERSION
import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  updateEmail as updateFirebaseEmail,
  updatePassword as updateFirebasePassword,
  EmailAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEs1VB737qtWep-kzMDhgAoeI4KgVJB00",
  authDomain: "pet-market-88fd9.firebaseapp.com",
  projectId: "pet-market-88fd9",
  storageBucket: "pet-market-88fd9.appspot.com",
  messagingSenderId: "205088036528",
  appId: "1:205088036528:web:bb8ef59f8394077c138d75",
  measurementId: "G-MJJ8KHVPKS"
};

// Initialize Firebase
let app;
let auth;
let googleProvider;

try {
  // Check if Firebase is already initialized
  if (getApps().length > 0) {
    app = getApps()[0];
  } else {
    app = initializeApp(firebaseConfig);
  }

  // Initialize services
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();

  // Configure Google Provider
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  // Add scopes
  googleProvider.addScope('email');
  googleProvider.addScope('profile');

  console.log('✅ Firebase initialized successfully');

} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

// ========== AUTHENTICATION FUNCTIONS ==========

// Google Sign In Functions
export const signInWithGooglePopup = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signInWithGoogleRedirect = () => {
  return signInWithRedirect(auth, googleProvider);
};

export const getGoogleRedirectResult = () => {
  return getRedirectResult(auth);
};

// Email/Password Authentication
export const registerWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const sendPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// User Profile Management
export const updateUserProfile = (user, profileData) => {
  return updateFirebaseProfile(user, profileData);
};

export const updateUserEmail = (user, newEmail) => {
  return updateFirebaseEmail(user, newEmail);
};

export const updateUserPassword = (user, newPassword) => {
  return updateFirebasePassword(user, newPassword);
};

// Auth State Listener
export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Sign Out
export const signOutUser = () => {
  return signOut(auth);
};

// ========== EXPORTS ==========

export { 
  auth, 
  googleProvider,
  EmailAuthProvider,
  updateFirebaseProfile,
  updateFirebaseEmail,
  updateFirebasePassword
};

export default app;