import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBaD01dK8FnVGQXrlyAhGIrhqLfkHSWagQ",
  authDomain: "lynx-locker-atkinssk.firebaseapp.com",
  projectId: "lynx-locker-atkinssk",
  storageBucket: "lynx-locker-atkinssk.firebasestorage.app",
  messagingSenderId: "37171517960",
  appId: "1:37171517960:web:7f1e6749c02c4a70d00fbd"
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

