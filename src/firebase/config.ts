import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDpnQWyB4Jj0aAbQVb5JMuHKaf6T6jDduw",
  authDomain: "emplo1-5a205.firebaseapp.com",
  databaseURL: "https://emplo1-5a205-default-rtdb.firebaseio.com",
  projectId: "emplo1-5a205",
  storageBucket: "emplo1-5a205.firebasestorage.app",
  messagingSenderId: "1082535725822",
  appId: "1:1082535725822:web:fa59e1fbf49fe1bb16f3af",
  measurementId: "G-L63SWW47WF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

export default app;