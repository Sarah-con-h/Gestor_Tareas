import { auth } from "./firebase.js";

import {
    signOut,
    onAuthStateChanged
}
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    query,
    where
}
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const nombre = document.getElementById("nombre");
const descripcion = document.getElementById("descripcion");
const lista = document.getElementById("listaProyectos");
const btnGuardar = document.getElementById("btnGuardar");
const proyectoId = document.getElementById("proyectoId");
const btnLogout = document.getElementById("btnLogout");

let editando = false;
let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location = "login.html";
        return;
    }

    currentUser = user;
    cargarProyectos();
});

if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
        await signOut(auth);
        window.location = "login.html";
    });
}

btnGuardar.addEventListener("click", async () => {
    if (nombre.value.trim() === "") {
        alert("Ingrese un nombre de proyecto.");
        return;
    }

    if (!currentUser) {
        alert("No se encontró sesión activa.");
        return;
    }

    if (editando) {
        await updateDoc(
            doc(db, "proyectos", proyectoId.value),
            {
                nombre: nombre.value,
                descripcion: descripcion.value
            }
        );

        editando = false;
        btnGuardar.textContent = "Guardar Proyecto";
    } else {
        await addDoc(
            collection(db, "proyectos"),
            {
                nombre: nombre.value,
                descripcion: descripcion.value,
                uid: currentUser.uid,
                email: currentUser.email
            }
        );
    }

    nombre.value = "";
    descripcion.value = "";

    cargarProyectos();
});

async function cargarProyectos() {
    lista.innerHTML = "";

    if (!currentUser) {
        return;
    }

    const proyectosQuery = query(
        collection(db, "proyectos"),
        where("uid", "==", currentUser.uid)
    );

    const datos = await getDocs(proyectosQuery);

    datos.forEach((item) => {
        lista.innerHTML += `
        <tr>
            <td>${item.data().nombre}</td>
            <td>${item.data().descripcion}</td>
            <td>
                <button
                    class="btn btn-warning editar"
                    data-id="${item.id}"
                    data-nombre="${item.data().nombre}"
                    data-descripcion="${item.data().descripcion}">
                    Editar
                </button>
                <button
                    class="btn btn-danger eliminar"
                    data-id="${item.id}">
                    Eliminar
                </button>
            </td>
        </tr>
        `;
    });

    document.querySelectorAll(".eliminar").forEach(btn => {
        btn.addEventListener("click", async () => {
            await deleteDoc(doc(db, "proyectos", btn.dataset.id));
            cargarProyectos();
        });
    });

    document.querySelectorAll(".editar").forEach(btn => {
        btn.addEventListener("click", () => {
            editando = true;
            proyectoId.value = btn.dataset.id;
            nombre.value = btn.dataset.nombre;
            descripcion.value = btn.dataset.descripcion;
            btnGuardar.textContent = "Actualizar Proyecto";
        });
    });
}
