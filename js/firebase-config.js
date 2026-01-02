// Firebase Configuration for NovaGlow
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBtsOY6rGJUjM9qDlZMUtJ9ctcxpLaNdaQ",
    authDomain: "b-novaglow.firebaseapp.com",
    projectId: "b-novaglow",
    storageBucket: "b-novaglow.firebasestorage.app",
    messagingSenderId: "522498872410",
    appId: "1:522498872410:web:2a3e4674997936a6f83463",
    measurementId: "G-SE8ZSBM7K5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Admin email
const ADMIN_EMAIL = "cycwithbhoomi05@gmail.com";

export { app, analytics, auth, db, storage, googleProvider, RecaptchaVerifier, signInWithPhoneNumber, ADMIN_EMAIL };

