import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// You can obtain these from the Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyDQt85KsCOnhCZMPpyloIbSUiRBvXLws-Q",
  authDomain: "wishprise.firebaseapp.com",
  projectId: "wishprise",
  storageBucket: "wishprise.firebasestorage.app",
  messagingSenderId: "975746598664",
  appId: "1:975746598664:web:ce4721f85764c29064cebd",
  measurementId: "G-VR29QHB6KV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);