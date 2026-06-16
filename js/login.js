import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
}
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const correo = document.getElementById("correo");
const password = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location = "index.html";
    }
});

btnLogin.addEventListener("click", async () => {
    if (!correo.value || !password.value) {
        alert("Por favor ingresa correo y contraseña.");
        return;
    }

    try {
        await signInWithEmailAndPassword(
            auth,
            correo.value,
            password.value
        );

        window.location = "index.html";
    } catch (error) {
        alert(error.message);
    }
});