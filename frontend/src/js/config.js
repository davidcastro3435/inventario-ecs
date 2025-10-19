// Configuración de la aplicacion
// Esa clase se encarga de manejar la configuración del usuario como cambio de contraseña, correo y creación de usuarios (solo admin)

import {
  patchContrasenaUsuario,
  patchCorreoUsuario,
  obtenerUsuariosAPI,
} from "../services/usuarioService.js";

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
			<td>${usr.id || ""}</td>
			<td>${usr.nombre || ""}</td>
			<td>${usr.correo || ""}</td>
			<td>${usr.rol || ""}</td>
			<td>${new Date(usr.ultimo_acceso || usr.fecha).toLocaleString()}</td>
		`;
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", cargarUsuarios);
