import express from "express";
import {
  loginUsuario,
  registrarUsuario,
  actualizarContrasenaUsuario,
  actualizarCorreoUsuario,
  obtenerUsuarios,
  reiniciarContrasenaUsuarioPorId,
  eliminarUsuarioPorId,
} from "../controllers/usuarioController.js";

const router = express.Router();

// Ruta para login de usuario
router.post("/login", loginUsuario);

// Ruta para registrar usuario
router.post("/register", registrarUsuario);

// Obtener lista de usuarios (solo administradores)
router.get("/", obtenerUsuarios);

router.patch("/datos/contrasena", actualizarContrasenaUsuario);

router.patch("/datos/correo", actualizarCorreoUsuario);

// Admin: reiniciar contraseña de otro usuario
router.patch("/:id/contrasena", reiniciarContrasenaUsuarioPorId);

router.delete("/:id", eliminarUsuarioPorId);

export default router;
