// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPvl2G1DvZAyyxRpJLj_A6gXLr8QI6ofY",
  authDomain: "aur0-auth.firebaseapp.com",
  projectId: "aur0-auth",
  storageBucket: "aur0-auth.firebasestorage.app",
  messagingSenderId: "845186580422",
  appId: "1:845186580422:web:856ac1df55420e8322bcc7",
  measurementId: "G-P2R7R6VLLK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
