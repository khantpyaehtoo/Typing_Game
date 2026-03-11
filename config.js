import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAlZOOiNjgLxMF5HIXPHc4YsePrQMDGnzA",
    authDomain: "typing-app-f3799.firebaseapp.com",
    projectId: "typing-app-f3799",
    storageBucket: "typing-app-f3799.firebasestorage.app",
    messagingSenderId: "962543314537",
    appId: "1:962543314537:web:40b46ef6aa15fc0697a4f8",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
