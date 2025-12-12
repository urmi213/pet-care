
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyDEs1VB737qtWep-kzMDhgAoeI4KgVJB00", 
  authDomain: "pet-market-88fd9.firebaseapp.com",
  projectId: "pet-market-88fd9",
  storageBucket: "pet-market-88fd9.appspot.com", 
  messagingSenderId: "205088036528",
  appId: "1:205088036528:web:bb8ef59f8394077c138d75",
  measurementId: "G-MJJ8KHVPKS"
};


let app;
let auth;
let googleProvider;

try {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();

  if (typeof window !== "undefined") {
    getAnalytics(app);
  }

  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization error:", error.code, error.message);
}

export { auth, googleProvider };
export default app;
