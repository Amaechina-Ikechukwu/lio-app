import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDIJzehZ9eXSxaD3HsdhenMlQwSMhe8mkg",
  authDomain: "lio-6af30.firebaseapp.com",
  projectId: "lio-6af30",
  storageBucket: "lio-6af30.appspot.com",
  messagingSenderId: "7297576120",
  appId: "1:72975761200:web:087f4acd25adce76dad2f5",
  databaseURL: "",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, storage, db };
