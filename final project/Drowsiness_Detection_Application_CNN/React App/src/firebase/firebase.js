// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use


// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQSq5ko3q7lY7nRLa5PeJXZXP85YupX0I",
  authDomain: "drowsiness-detection-bd6d0.firebaseapp.com",
  projectId: "drowsiness-detection-bd6d0",
  storageBucket: "drowsiness-detection-bd6d0.appspot.com",
  messagingSenderId: "569496182650",
  appId: "1:569496182650:web:731b80ccbb3ca0483140c3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
