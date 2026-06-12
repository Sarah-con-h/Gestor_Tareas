import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc
}
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const nombre = document.getElementById("nombre");
const descripcion = document.getElementById("descripcion");
const lista = document.getElementById("listaProyectos");
const btnGuardar = document.getElementById("btnGuardar");
const proyectoId = document.getElementById("proyectoId");

let editando = false;

btnGuardar.addEventListener("click", async () => {

    if (nombre.value === "") {

        alert("Ingrese un nombre");

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

        btnGuardar.textContent =
            "Guardar Proyecto";

    } else {

        await addDoc(
            collection(db, "proyectos"),
            {
                nombre: nombre.value,
                descripcion: descripcion.value
            }
        );

    }

    nombre.value = "";
    descripcion.value = "";

    cargarProyectos();

});

async function cargarProyectos() {

    lista.innerHTML = "";

    const datos =
        await getDocs(collection(db, "proyectos"));

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

    document
        .querySelectorAll(".eliminar")
        .forEach(btn => {

            btn.addEventListener("click", async () => {

                await deleteDoc(
                    doc(db, "proyectos", btn.dataset.id)
                );

                cargarProyectos();

            });

        });

    document
        .querySelectorAll(".editar")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                editando = true;

                proyectoId.value =
                    btn.dataset.id;

                nombre.value =
                    btn.dataset.nombre;

                descripcion.value =
                    btn.dataset.descripcion;

                btnGuardar.textContent =
                    "Actualizar Proyecto";

            });

        });

}

cargarProyectos();