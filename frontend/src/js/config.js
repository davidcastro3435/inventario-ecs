// Configuración de la aplicacion
// Esa clase se encarga de manejar la configuración del usuario como cambio de contraseña, correo y creación de usuarios (solo admin)

import {
  patchContrasenaUsuario,
  patchCorreoUsuario,
  obtenerUsuariosAPI,
  eliminarUsuarioAPI,
} from "../services/usuarioService.js";

import {
  initModalEliminar,
  mostrarModalEliminar,
} from "./modals/modalEliminar.js";

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
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      try {
        await patchContrasenaUsuario({ nuevaContrasena });
        alert("Contraseña actualizada correctamente.");
        inputNuevaContrasena.value = "";
      } catch (err) {
        alert("Error al actualizar la contraseña.");
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
        alert("Introduce un correo electrónico válido.");
        return;
      }

      try {
        await patchCorreoUsuario({ nuevoCorreo });
        alert("Correo actualizado correctamente.");
        inputNuevoCorreo.value = "";
      } catch (err) {
        alert("Error al actualizar el correo.");
      }
    });
  }
});

// Función para cargar los movimientos de la bitácora
async function cargarUsuarios() {
  try {
    const usuarios = await obtenerUsuariosAPI();
    renderizarTablaUsuarios(usuarios);
  } catch (err) {
    alert("No se pudo cargar la tabla");
  }
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

  initModalEliminar();
  // Inicializar modal eliminar solo para admins
  if (decodificarToken() === "admin") {
    // Delegación de eventos para botones de eliminar en la tabla de configuración
    const tbody = document.querySelector(".configuracion-table tbody");
    if (tbody) {
      tbody.addEventListener("click", async (e) => {
        const btnDelete = e.target.closest(".btn-delete");
        if (!btnDelete) return;

        const id = btnDelete.getAttribute("data-id");
        // Intentar obtener el nombre desde la fila para mostrar en el modal
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
                alert("Usuario eliminado correctamente");
              } catch (err) {
                alert("Error al eliminar usuario: " + (err.message || err));
              }
            },
          });
        } catch (err) {
          alert(
            "Error al mostrar el modal de eliminar: " + (err.message || err),
          );
        }
      });
    }
  } else {
    // Si no es admin, solo cargar usuarios (sin inicializar modal)
    cargarUsuarios();
  }
});
