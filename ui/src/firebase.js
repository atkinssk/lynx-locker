import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  // These should be populated by the user in the Firebase Console
  // For development, we'll use placeholder values or wait for user to provide them
  apiKey: "AIzaSyDummyKey",
  authDomain: "lynx-locker-atkinssk.firebaseapp.com",
  projectId: "lynx-locker-atkinssk",
  storageBucket: "lynx-locker-atkinssk.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghij"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

if (window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);
}

