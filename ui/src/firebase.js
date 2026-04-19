import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // These should be populated by the user in the Firebase Console
  // For development, we'll use placeholder values or wait for user to provide them
  apiKey: "AIzaSyDummyKey",
  authDomain: "lynx-locker-app.firebaseapp.com",
  projectId: "lynx-locker-app",
  storageBucket: "lynx-locker-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghij"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
