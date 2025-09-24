

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
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

const firebaseConfig2 = {
    apiKey: "AIzaSyCIqlMMb1yteZbkehFU3lz6-91fVDxmrZ8",
    authDomain: "firmwareflash-3.firebaseapp.com",
    databaseURL: "https://firmwareflash-3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "firmwareflash-3",
    storageBucket: "firmwareflash-3.firebasestorage.app",
    messagingSenderId: "658862711175",
    appId: "1:658862711175:web:489354a3c852babc86f322",
    measurementId: "G-J6NGRK9987"
};

// Initialize Firebase
// To avoid reinitialization errors, check if apps are already initialized.
function initializeFirebaseApp(config: object, name?: string): FirebaseApp {
    const apps = getApps();
    if (name) {
        const namedApp = apps.find(app => app.name === name);
        if (namedApp) return namedApp;
        return initializeApp(config, name);
    }
    if (apps.length === 0) {
        return initializeApp(config);
    }
    return getApp();
}

const app = initializeFirebaseApp(firebaseConfig);
const app1 = initializeFirebaseApp(firebaseConfig1, 'db-1');
const app2 = initializeFirebaseApp(firebaseConfig2, 'db-2');


// --- Firestore Databases ---

// Database 1 (Default) - firmwareflash-1
const db = getFirestore(app);

// Database 2
const db_1 = getFirestore(app1);

// Database 3
const db_2 = getFirestore(app2);

// --- Realtime Database ---
const rtdb = getDatabase(app);


export { 
  app, 
  db,
  db_1,
  db_2,
  rtdb,
};
