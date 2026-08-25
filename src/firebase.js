import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD4U8Zg04xcpU9bc1Z__cp_cvkhM9t2-Bc",
    authDomain: "netzwerkneu.firebaseapp.com",
    projectId: "netzwerkneu",
    storageBucket: "netzwerkneu.firebasestorage.app",
    messagingSenderId: "680912448325",
    appId: "1:680912448325:web:d7e745d8ee932e309dac2c",
    measurementId: "G-FJFGB4BRF9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);