// inventario.js
// Obtiene los datos del inventario desde el API y los muestra en la tabla de inventory.html

import {
  obtenerInventarioAPI,
  obtenerItemPorIdAPI,
  crearItemAPI,
  eliminarItemAPI,
  patchItemAPI,
  patchItemStockAPI,
} from "../services/inventarioService.js";

import {
  initModalEliminar,
  mostrarModalEliminar,
} from "./modals/modalEliminar.js";

import {
  iniciarModalAgregar,
  mostrarModalAgregar,
} from "./modals/modalAgregar.js";

import {
  iniciarModalQuitar,
  mostrarModalQuitar,
} from "./modals/modalQuitar.js";

import { requireAuth } from "./authGuard.js";

// Requerir autenticación al cargar el módulo; redirige si el token está ausente o expirado
requireAuth();

// -----------------------
// Toast helper (Bootstrap)
// -----------------------
// Crea un contenedor de toasts en la esquina superior derecha si no existe
function ensureToastContainer() {
  if (document.getElementById("toast-container")) return;
  const container = document.createElement("div");
  container.id = "toast-container";
  // Posicionar en esquina superior derecha
  container.style.position = "fixed";
  container.style.top = "1rem";
  container.style.right = "1rem";
  container.style.zIndex = "1080"; // por encima de la mayoría de elementos
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "0.5rem";
  document.body.appendChild(container);
}

// Muestra un toast usando Bootstrap 5
// type puede ser: 'primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark'
function showToast(message, type = "primary", delay = 4000) {
  ensureToastContainer();
  const container = document.getElementById("toast-container");

  const toastEl = document.createElement("div");
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");

  // Construir contenido del toast
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body" style="white-space: pre-wrap;">${String(message)}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  container.appendChild(toastEl);

  // Inicializar y mostrar usando el objeto global `bootstrap`
  try {
    const toast = new bootstrap.Toast(toastEl, { delay });
    toast.show();
    // Eliminar del DOM cuando se oculte
    toastEl.addEventListener("hidden.bs.toast", () => {
      try {
        toastEl.remove();
      } catch (e) {}
    });
  } catch (e) {
    // Si por alguna razón Bootstrap no está disponible, caer en fallback a console
    console.warn("Bootstrap Toast no disponible:", e);
    console.log(message);
  }
}

// Función para obtener los items del API usando el service
async function obtenerInventario() {
  try {
    const items = await obtenerInventarioAPI();
    mostrarInventario(items);
  } catch (error) {
    mostrarError("No se pudo cargar el inventario");
  }
}

// Función para decodificar el token y obtener el rol del usuario
function decodificarToken() {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.rol;
  }
  return null;
}

// Función para mostrar los items en la tabla
function mostrarInventario(items) {
  const tbody = document.querySelector(".inventory-table tbody");
  tbody.innerHTML = "";
  const rol = decodificarToken();
  items.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.id_producto}</td>
      <td>${item.nombre}</td>
      <td>${item.descripcion}</td>
      <td>${item.nombre_categoria}</td>
      <td>${item.stock_actual}</td>
      <td class="d-flex gap-1">
          <button class="btn btn-success btn-sm action-btn btn-add" title="Agregar" data-id="${item.id_producto}"><i class="bi bi-plus-lg"></i></button>
          <button class="btn btn-secondary btn-sm action-btn btn-subtract" title="Quitar" data-id="${item.id_producto}"><i class="bi bi-dash-lg"></i></button>
          ${rol === "admin" ? `<button class="btn btn-primary btn-sm action-btn btn-modificar" title="Modificar" data-id="${item.id_producto}"><i class="bi bi-pencil-square"></i></button>` : ""}
          ${rol === "admin" ? `<button class="btn btn-danger btn-sm action-btn btn-eliminar" title="Eliminar" data-id="${item.id_producto}"><i class="bi bi-trash-fill"></i></button>` : ""}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Función para mostrar errores en la tabla
function mostrarError(mensaje) {
  const tbody = document.querySelector(".inventory-table tbody");
  tbody.innerHTML = `<tr><td colspan="6" style="color:red;text-align:center;">${mensaje}</td></tr>`;
}

// Mostrar offcanvas al hacer click en btn-create
document.addEventListener("DOMContentLoaded", function () {
  obtenerInventario();

  // Inicializar el modal de eliminar (se crea en el DOM si no existe)
  if (decodificarToken() === "admin") {
    initModalEliminar();
  }
  iniciarModalAgregar();
  iniciarModalQuitar();

  const tbody = document.querySelector(".inventory-table tbody");
  if (tbody) {
    tbody.addEventListener("click", async (e) => {
      const btnEliminar = e.target.closest(".btn-eliminar");
      if (!btnEliminar) return;

      const id = btnEliminar.getAttribute("data-id");
      try {
        const item = await obtenerItemPorIdAPI(id);
        if (!item) {
          showToast("No se encontró el item.", "danger");
          return;
        }

        mostrarModalEliminar({
          id,
          nombre: item.nombre,
          onDescartar: () => console.log("Cancelado"),
          onEliminar: async (itemId) => {
            await eliminarItemAPI(itemId);
            obtenerInventario();
            showToast(`Item ${item.nombre} eliminado correctamente`, "success");
          },
        });
      } catch (err) {
        showToast("Error al cargar el item: " + (err.message || err), "danger");
      }
    });
  }

  // Evento para mostrar el modal agregar stock
  const tbodyAgregar = document.querySelector(".inventory-table tbody");
  if (tbodyAgregar) {
    tbodyAgregar.addEventListener("click", async function (e) {
      const btnAdd = e.target.closest(".btn-add");
      if (btnAdd) {
        const id = btnAdd.getAttribute("data-id");
        try {
          const item = await obtenerItemPorIdAPI(id);
          if (!item) {
            showToast("No se encontró el item.", "danger");
            return;
          }
          mostrarModalAgregar({
            id,
            onDescartar: () => {},
            onAceptar: async (cantidad) => {
              try {
                await patchItemStockAPI(id, {
                  stock_actual: Number(item.stock_actual) + Number(cantidad),
                });
                obtenerInventario();
                showToast(`Stock agregado correctamente`, "success");
              } catch (err) {
                showToast(
                  "Error al agregar stock: " + (err.message || err),
                  "danger",
                );
              }
            },
          });
        } catch (err) {
          showToast(
            "Error al cargar el item: " + (err.message || err),
            "danger",
          );
        }
      }
    });
  }

  // Evento para mostrar el modal quitar stock
  const tbodyQuitar = document.querySelector(".inventory-table tbody");
  if (tbodyQuitar) {
    tbodyQuitar.addEventListener("click", async function (e) {
      const btnSubtract = e.target.closest(".btn-subtract");
      if (btnSubtract) {
        const id = btnSubtract.getAttribute("data-id");
        try {
          const item = await obtenerItemPorIdAPI(id);
          if (!item) {
            showToast("No se encontró el item.", "danger");
            return;
          }
          mostrarModalQuitar({
            id,
            onDescartar: () => {},
            onAceptar: async (cantidad) => {
              // Lógica para remover stock usando patchItemAPI
              try {
                await patchItemStockAPI(id, {
                  stock_actual: Number(item.stock_actual) - Number(cantidad),
                });
                obtenerInventario();
                showToast(`Stock removido correctamente`, "success");
              } catch (err) {
                showToast(
                  "Error al remover stock: " + (err.message || err),
                  "danger",
                );
              }
            },
          });
        } catch (err) {
          showToast(
            "Error al cargar el item: " + (err.message || err),
            "danger",
          );
        }
      }
    });
  }
});
