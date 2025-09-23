
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  "projectId": "studio-61480213-2f0c9",
  "appId": "1:206750425989:web:3078713a6c081f0d51daec",
  "apiKey": "AIzaSyAGIslqX5KMbxbL_ooKU_SYTHUUas2qlIg",
  "authDomain": "studio-61480213-2f0c9.firebaseapp.com",
  "storageBucket": "studio-61480213-2f0c9.appspot.com",
  "messagingSenderId": "206750425989"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// --- Firestore Databases ---

// Database 1 (Default)
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


export { 
  app, 
  db,
  db_1,
  db_2,
  db_3,
};
