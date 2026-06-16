import { auth } from "./firebase.js";
import {
    onAuthStateChanged,
    signOut
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

const titulo = document.getElementById("titulo");
const descripcionTarea = document.getElementById("descripcionTarea");
const estado = document.getElementById("estado");
const prioridad = document.getElementById("prioridad");
const usuario = document.getElementById("usuario");
const btnLogout = document.getElementById("btnLogout");

const listaTareas = document.getElementById("listaTareas");
const btnGuardarTarea = document.getElementById("btnGuardarTarea");
const tareaId = document.getElementById("tareaId");

let editando = false;
let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location = "login.html";
        return;
    }

    currentUser = user;
    cargarTareas();
});

if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
        await signOut(auth);
        window.location = "login.html";
    });
}

btnGuardarTarea.addEventListener("click", async () => {
    if (titulo.value.trim() === "") {
        alert("Ingrese un título");
        return;
    }

    if (!currentUser) {
        alert("No se encontró sesión activa.");
        return;
    }

    if (editando) {
        await updateDoc(
            doc(db, "tareas", tareaId.value),
            {
                titulo: titulo.value,
                descripcion: descripcionTarea.value,
                estado: estado.value,
                prioridad: prioridad.value,
                usuario: usuario.value
            }
        );

        editando = false;
        btnGuardarTarea.textContent = "Guardar Tarea";
    } else {
        await addDoc(
            collection(db, "tareas"),
            {
                titulo: titulo.value,
                descripcion: descripcionTarea.value,
                estado: estado.value,
                prioridad: prioridad.value,
                usuario: usuario.value,
                uid: currentUser.uid,
                email: currentUser.email
            }
        );
    }

    limpiarFormulario();
    cargarTareas();
});

async function cargarTareas() {
    listaTareas.innerHTML = "";

    if (!currentUser) {
        return;
    }

    const tareasQuery = query(
        collection(db, "tareas"),
        where("uid", "==", currentUser.uid)
    );

    const datos = await getDocs(tareasQuery);

    datos.forEach((item) => {
        listaTareas.innerHTML += `
        <tr>
            <td>${item.data().titulo}</td>
            <td>${item.data().descripcion}</td>
            <td>${item.data().estado}</td>
            <td>${item.data().prioridad}</td>
            <td>${item.data().usuario}</td>
            <td>
                <button
                    class="btn btn-warning editar"
                    data-id="${item.id}"
                    data-titulo="${item.data().titulo}"
                    data-descripcion="${item.data().descripcion}"
                    data-estado="${item.data().estado}"
                    data-prioridad="${item.data().prioridad}"
                    data-usuario="${item.data().usuario}">
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
            await deleteDoc(doc(db, "tareas", btn.dataset.id));
            cargarTareas();
        });
    });

    document.querySelectorAll(".editar").forEach(btn => {
        btn.addEventListener("click", () => {
            editando = true;
            tareaId.value = btn.dataset.id;
            titulo.value = btn.dataset.titulo;
            descripcionTarea.value = btn.dataset.descripcion;
            estado.value = btn.dataset.estado;
            prioridad.value = btn.dataset.prioridad;
            usuario.value = btn.dataset.usuario;
            btnGuardarTarea.textContent = "Actualizar Tarea";
        });
    });
}

function limpiarFormulario() {
    titulo.value = "";
    descripcionTarea.value = "";
    estado.value = "pendiente";
    prioridad.value = "alta";
    usuario.value = "";
    tareaId.value = "";
}

cargarTareas();