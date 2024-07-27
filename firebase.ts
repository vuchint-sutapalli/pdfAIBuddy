import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDEkcgUzLiNrAnY8lVHJV-wFj9s1bs9aY",
  authDomain: "chat-with-pdf-9cc9d.firebaseapp.com",
  projectId: "chat-with-pdf-9cc9d",
  storageBucket: "chat-with-pdf-9cc9d.appspot.com",
  messagingSenderId: "404973843070",
  appId: "1:404973843070:web:f8854884bd28f1bd4d9e2f",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
