import { crearUsuarioAPI } from "../../services/usuarioService.js";

import { showToast } from "../toastHelper.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnAbrir = document.getElementById("btnAbrirNuevoUsuario");
  const offcanvasEl = document.getElementById("offcanvasNuevoUsuario");
  const formNuevoUsuario = document.getElementById("formNuevoUsuario");
  if (btnAbrir && offcanvasEl) {
    btnAbrir.addEventListener("click", () => {
      // Evitar crear múltiples instancias que dejen backdrops sueltos
      let offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (!offcanvas) offcanvas = new bootstrap.Offcanvas(offcanvasEl);
      offcanvas.show();
    });
  }

  if (formNuevoUsuario) {
    formNuevoUsuario.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre = document.getElementById("nuevoUsuarioNombre").value.trim();
      const correo = document.getElementById("nuevoUsuarioCorreo").value.trim();
      const contrasena = document.getElementById("nuevoUsuarioPassword").value;
      const rol = document.getElementById("nuevoUsuarioRol").value;

      if (!nombre || !correo || !contrasena) {
        showToast("Completa todos los campos.", "warning");
        return;
      }

      try {
        await crearUsuarioAPI({ nombre, correo, contrasena, rol });
        showToast("Usuario creado correctamente", "success");
        // Obtener la instancia existente y ocultarla
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvas) {
          offcanvas.hide();
        }
        formNuevoUsuario.reset();
      } catch (err) {
        showToast(
          "Error al crear el usuario: " + (err.message || err),
          "danger",
        );
      }
    });
  }
});
