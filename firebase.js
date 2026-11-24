import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrQgCVw3zPecSyBQPW5ZMJ4clbVuCMePc",
  authDomain: "microapps-514ce.firebaseapp.com",
  projectId: "microapps-514ce",
  storageBucket: "microapps-514ce.firebasestorage.app",
  messagingSenderId: "798478047961",
  appId: "1:798478047961:web:eac244130c702ed425bcc8",
  measurementId: "G-GKKX3717QG"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);