import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBV1j0FJzwKy_wpyLPcJ_FA9EqphkVh2_g",
    authDomain: "scanbizz-100d6.firebaseapp.com",
    projectId: "scanbizz-100d6",
    storageBucket: "scanbizz-100d6.firebasestorage.app",
    messagingSenderId: "710419136154",
    appId: "1:710419136154:web:c7d3fc6a3c0722b3e2e923"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

export default app;