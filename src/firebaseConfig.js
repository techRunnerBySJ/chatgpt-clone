import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBjXQGra_hP56jkJxgbHS0zHSgSktBypOQ",
    authDomain: "chaibot-d8265.firebaseapp.com",
    projectId: "chaibot-d8265",
    storageBucket: "chaibot-d8265.firebasestorage.app",
    messagingSenderId: "81878171669",
    appId: "1:81878171669:web:a48817ae9845c1bf1c4e1c",
    measurementId: "G-VHXBB4T08X",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);