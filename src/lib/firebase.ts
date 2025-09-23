
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

const firebaseConfig1 = {
  apiKey: "AIzaSyDuTxeFWWwt2eKJoB0be8muFapdD2sWu1o",
  authDomain: "firmwareflash-2.firebaseapp.com",
  databaseURL: "https://firmwareflash-2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "firmwareflash-2",
  storageBucket: "firmwareflash-2.firebasestorage.app",
  messagingSenderId: "895515962697",
  appId: "1:895515962697:web:228afec97161279481be98",
  measurementId: "G-KWBHVFW00B"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const app1 = initializeApp(firebaseConfig1, 'db-1');


// --- Firestore Databases ---

// Database 1 (Default) - firmwareflash-1
const db = getFirestore(app);

// Database 2
const db_1 = getFirestore(app1);

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
