import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
    apiKey: "AIzaSyDsWu_syd-NjKqFOB56YonXUkg8oBrNYzY",
    authDomain: "gastos-con-chatgpt.firebaseapp.com",
    projectId: "gastos-con-chatgpt",
    storageBucket: "gastos-con-chatgpt.firebasestorage.app",
    messagingSenderId: "871204010604",
    appId: "1:871204010604:web:5fdfeeb62c34aeb5cff649",
    measurementId: "G-0E0YH0QMW6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export default db;
