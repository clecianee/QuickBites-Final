import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA18W-RgY0T0ffQyGJhpr5ume7LVBbc6yc",
  authDomain: "quickbites-ebdce.firebaseapp.com",
  projectId: "quickbites-ebdce",
  storageBucket: "quickbites-ebdce.firebasestorage.app",
  messagingSenderId: "971633896820",
  appId: "1:971633896820:web:cc122746de6a207e185021",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);