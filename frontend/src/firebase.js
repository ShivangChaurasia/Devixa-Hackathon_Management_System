import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";

// Devixa Web App Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        avatar: user.photoURL || '',
      },
    };
  } catch (error) {
    console.error("Firebase Google Auth popup failed:", error);
    if (error.code === 'auth/popup-blocked') {
      console.log("Popup blocked. Falling back to signInWithRedirect...");
      try {
        await signInWithRedirect(auth, googleProvider);
        return { redirecting: true };
      } catch (redirectError) {
        console.error("Firebase Google Auth redirect failed:", redirectError);
        return {
          success: false,
          error: redirectError.message,
        };
      }
    }
    return {
      success: false,
      error: error.message,
    };
  }
};

export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const user = result.user;
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          avatar: user.photoURL || '',
        },
      };
    }
    return null;
  } catch (error) {
    console.error("Firebase Redirect Result Error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
