import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAp4HyHL0EmnOyZyKjQgPfSa7LWhpvqkHM",
  authDomain: "gestor-tareas-13535.firebaseapp.com",
  projectId: "gestor-tareas-13535",
  storageBucket: "gestor-tareas-13535.firebasestorage.app",
  messagingSenderId: "709922209285",
  appId: "1:709922209285:web:878ede1c038e125a3e266c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);