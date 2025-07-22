// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMPPG4xEol3d66uDz12RTYjb3jIdS8hgI",
  authDomain: "filterbot-daca0.firebaseapp.com",
  databaseURL: "https://filterbot-daca0-default-rtdb.firebaseio.com",
  projectId: "filterbot-daca0",
  storageBucket: "filterbot-daca0.appspot.com",
  messagingSenderId: "926186855801",
  appId: "1:926186855801:web:8282a2c875f6a7e2a3a3a8",
  measurementId: "G-0JXWQEP3X2"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
