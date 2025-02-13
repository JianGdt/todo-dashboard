// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";;
const firebaseConfig = {
  apiKey: "AIzaSyCcX7Att1SMq0vsxkWGpQ0_S9gARHLoW6c",
  authDomain: "todo-dashboard-8b192.firebaseapp.com",
  projectId: "todo-dashboard-8b192",
  storageBucket: "todo-dashboard-8b192.firebasestorage.app",
  messagingSenderId: "949671809828",
  appId: "1:949671809828:web:35838e704679fafec919b1",
  measurementId: "G-S5FYLWS7QB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export {
    app,
    analytics,
    db
}