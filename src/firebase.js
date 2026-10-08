import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCeqzGRhtYdctvgTduzYOxQ28mKkeo7fvc",
  authDomain: "qrbaseclearancesystem.firebaseapp.com",
  databaseURL: "https://qrbaseclearancesystem-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "qrbaseclearancesystem",
  storageBucket: "qrbaseclearancesystem.firebasestorage.app",
  messagingSenderId: "281673008109",
  appId: "1:281673008109:web:fcb27c7103ac0ea1e65de4",
  measurementId: "G-Y7P2S8XL6L",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const analytics = getAnalytics(app);
export default app;
