import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged
}
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const correo = document.getElementById("correo");
const password = document.getElementById("password");
const btnRegistro = document.getElementById("btnRegistro");

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location = "index.html";
    }
});

btnRegistro.addEventListener("click", async () => {
    if (!correo.value || !password.value) {
        alert("Por favor ingresa correo y contraseña.");
        return;
    }

    try {
        await createUserWithEmailAndPassword(
            auth,
            correo.value,
            password.value
        );

        window.location = "index.html";
    } catch (error) {
        alert(error.message);
    }
});