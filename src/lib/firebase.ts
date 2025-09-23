
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAL0C5gZ9Xtk4mMe6OkROBrhVPpabF9mL4",
  authDomain: "firmwareflash-1.firebaseapp.com",
  projectId: "firmwareflash-1",
  storageBucket: "firmwareflash-1.firebasestorage.app",
  messagingSenderId: "747871339448",
  appId: "1:747871339448:web:eec8edc05650e78009c54d",
  measurementId: "G-0W8EJHVQ9L",
  databaseURL: "https://firmwareflash-1-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// --- Firestore Databases ---

// Database 1 (Default) - firmwareflash-1
const db = getFirestore(app);

// Database 2
// NOTE: You must create a database with this ID in your Firebase project.
const db_1 = getFirestore(app, "firestore-db-1");

// Database 3
// NOTE: You must create a database with this ID in your Firebase project.
const db_2 = getFirestore(app, "firestore-db-2");

// Database 4
// NOTE: You must create a database with this ID in your Firebase project.
const db_3 = getFirestore(app, "firestore-db-3");

// --- Realtime Database ---
const rtdb = getDatabase(app);


export { 
  app, 
  db,
  db_1,
  db_2,
  db_3,
  rtdb,
};
