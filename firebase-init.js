// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXJ1u1nqSjCJxS-IoqVQcLAHYoojk7lqY",
  authDomain: "taxilytics-38004.firebaseapp.com",
  projectId: "taxilytics-38004",
  storageBucket: "taxilytics-38004.firebasestorage.app",
  messagingSenderId: "677532035887",
  appId: "1:677532035887:web:66b466100897c005f84fda"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, deleteDoc, doc, onSnapshot };
