// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA5mjQNbPc_xHFvSiE7mL56q-gN_lAhbI",
  authDomain: "expensetracker-a3278.firebaseapp.com",
  projectId: "expensetracker-a3278",
  storageBucket: "expensetracker-a3278.appspot.com",
  messagingSenderId: "544045066936",
  appId: "1:544045066936:web:54e542929e6630e6ee224d",
  measurementId: "G-XPNE78HDK7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage=getStorage(app);