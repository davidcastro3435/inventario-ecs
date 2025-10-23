// Configuración de la aplicacion
// Esa clase se encarga de manejar la configuración del usuario como cambio de contraseña, correo y creación de usuarios (solo admin)

import {
  patchContrasenaUsuario,
  patchCorreoUsuario,
  obtenerUsuariosAPI,
  eliminarUsuarioAPI,
  reiniciarContrasenaUsuario,
} from "../services/usuarioService.js";

import {
  initModalEliminar,
  mostrarModalEliminar,
} from "./modals/modalEliminar.js";

import {
  initModalReiniciar,
  mostrarModalReiniciar,
} from "./modals/modalReiniciar.js";

import { requireAuth } from "./authGuard.js";
import { showToast } from "./toastHelper.js";

// Requerir autenticación al cargar el módulo; redirige si el token está ausente o expirado
requireAuth();

// Función para decodificar el token y obtener el rol del usuario
function decodificarToken() {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.rol;
  }
  return null;
}

// Evento para cambiar contraseña
document.addEventListener("DOMContentLoaded", () => {
  const inputNuevaContrasena = document.getElementById("inputNuevaContrasena");
  const btnCambiarContrasena = document.getElementById("btnCambiarContrasena");

  if (btnCambiarContrasena && inputNuevaContrasena) {
    btnCambiarContrasena.addEventListener("click", async () => {
      const nuevaContrasena = inputNuevaContrasena.value.trim();
      if (!nuevaContrasena || nuevaContrasena.length < 6) {
        showToast("La contraseña debe tener al menos 6 caracteres.", "warning");
        return;
      }

      try {
        await patchContrasenaUsuario({ nuevaContrasena });
        showToast("Contraseña actualizada correctamente.", "success");
        inputNuevaContrasena.value = "";
      } catch (err) {
        showToast("Error al actualizar la contraseña.", "danger");
      }
    });
  }
});

// Evento para cambiar correo
document.addEventListener("DOMContentLoaded", () => {
  const inputNuevoCorreo = document.getElementById("inputNuevoCorreo");
  const btnCambiarCorreo = document.getElementById("btnCambiarCorreo");

  if (btnCambiarCorreo && inputNuevoCorreo) {
    btnCambiarCorreo.addEventListener("click", async () => {
      const nuevoCorreo = inputNuevoCorreo.value.trim();
      // Validación básica de correo
      const correoRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!nuevoCorreo || !correoRegex.test(nuevoCorreo)) {
        showToast("Introduce un correo electrónico válido.", "warning");
        return;
      }

      try {
        await patchCorreoUsuario({ nuevoCorreo });
        showToast("Correo actualizado correctamente.", "success");
        inputNuevoCorreo.value = "";
      } catch (err) {
        showToast("Error al actualizar el correo.", "danger");
      }
    });
  }
});

// Función para cargar los movimientos de la bitácora
async function cargarUsuarios() {
  try {
    const usuarios = await obtenerUsuariosAPI();
    renderizarTablaUsuarios(usuarios);
  } catch (err) {}
}

// Función para renderizar la tabla
function renderizarTablaUsuarios(usuarios) {
  const tbody = document.querySelector(".configuracion-table tbody");
  tbody.innerHTML = "";
  const rol = decodificarToken();
  usuarios.forEach((usr) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
			<td>${usr.id_usuario || ""}</td>
			<td>${usr.nombre || ""}</td>
			<td>${usr.correo || ""}</td>
			<td>${usr.rol || ""}</td>
			<td>${new Date(usr.ultimo_acceso || usr.fecha).toLocaleString()}</td>
			<td class="d-flex gap-1">
        <button class="btn btn-primary btn-sm action-btn btn-reset" title="Reiniciar" data-id="${usr.id_usuario}"><i class="bi bi-arrow-counterclockwise"></i></button>
        <button class="btn btn-danger btn-sm action-btn btn-delete" title="Eliminar" data-id="${usr.id_usuario}"><i class="bi bi-trash-fill"></i></button>
      </td>
		`;
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Cargar la tabla inicialmente
  cargarUsuarios();

  // Verificar rol en tiempo de ejecución y ocultar UI admin si es necesario.
  // Hacemos una comprobación temprana para evitar que la UI admin parpadee.
  const role = decodificarToken();
  const adminSection =
    document.getElementById("adminSection") ||
    document.querySelector(".table-wrapper");
  const btnCrear = document.getElementById("btnAbrirNuevoUsuario");

  if (role !== "admin") {
    if (adminSection) adminSection.style.display = "none";
    if (btnCrear) btnCrear.style.display = "none";
    // No inicializamos modales ni handlers administrativos
    return;
  }

  // Si es admin, inicializamos modales y delegación de eventos
  initModalEliminar();
  initModalReiniciar();

  const tbody = document.querySelector(".configuracion-table tbody");
  if (tbody) {
    tbody.addEventListener("click", async (e) => {
      // Priorizar botón de reinicio (btn-reset) y luego eliminar (btn-delete)
      const btnReset = e.target.closest(".btn-reset");
      if (btnReset) {
        const id = btnReset.getAttribute("data-id");
        let nombre = "";
        const tr = btnReset.closest("tr");
        if (tr) {
          const nombreCell = tr.querySelector("td:nth-child(2)");
          if (nombreCell) nombre = nombreCell.textContent.trim();
        }

        try {
          mostrarModalReiniciar({
            id,
            nombre: nombre || `ID ${id}`,
            onDescartar: () => {},
            onReiniciar: async (userId, nuevaContrasena) => {
              try {
                await reiniciarContrasenaUsuario(userId, nuevaContrasena);
                await cargarUsuarios();
                showToast(
                  `Contraseña reiniciada a \"${nuevaContrasena}\" para ${nombre || userId}`,
                  "success",
                );
              } catch (err) {
                showToast(
                  "Error al reiniciar contraseña: " + (err.message || err),
                  "danger",
                );
              }
            },
          });
        } catch (err) {
          showToast(
            "Error al mostrar el modal de reiniciar: " + (err.message || err),
            "danger",
          );
        }

        return;
      }

      const btnDelete = e.target.closest(".btn-delete");
      if (!btnDelete) return;

      const id = btnDelete.getAttribute("data-id");
      let nombre = "";
      const tr = btnDelete.closest("tr");
      if (tr) {
        const nombreCell = tr.querySelector("td:nth-child(2)");
        if (nombreCell) nombre = nombreCell.textContent.trim();
      }

      try {
        mostrarModalEliminar({
          id,
          nombre: nombre,
          onDescartar: () => {},
          onEliminar: async (userId) => {
            try {
              await eliminarUsuarioAPI(userId);
              await cargarUsuarios();
              showToast("Usuario eliminado correctamente", "success");
            } catch (err) {
              showToast(
                "Error al eliminar usuario: " + (err.message || err),
                "danger",
              );
            }
          },
        });
      } catch (err) {
        showToast(
          "Error al mostrar el modal de eliminar: " + (err.message || err),
          "danger",
        );
      }
    });
  }
});
