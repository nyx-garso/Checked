// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDVTbildaR6IZerq9HUxvuiu6hjDNuDnR0",
  authDomain: "checked-4e84b.firebaseapp.com",
  projectId: "checked-4e84b",
  storageBucket: "checked-4e84b.firebasestorage.app",
  messagingSenderId: "333795349318",
  appId: "1:333795349318:web:bb641048bb6e8725744b47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export initialized services
export const auth = getAuth(app);
export const db = getFirestore(app);
