// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
const db = getFirestore(app);

export { app, db };
