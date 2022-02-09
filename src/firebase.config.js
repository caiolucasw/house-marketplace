// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCt0x9huWAjkVcV8N-iwp9z-JlLIFP9Wuo",
  authDomain: "house-marketplace-projec-a386f.firebaseapp.com",
  projectId: "house-marketplace-projec-a386f",
  storageBucket: "house-marketplace-projec-a386f.appspot.com",
  messagingSenderId: "29560132013",
  appId: "1:29560132013:web:f5a47a5534bd3898f65124"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();