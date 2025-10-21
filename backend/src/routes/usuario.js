import express from "express";
import {
  loginUsuario,
  registrarUsuario,
  actualizarContrasenaUsuario,
  actualizarCorreoUsuario,
  obtenerUsuarios,
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

router.delete("/:id", eliminarUsuarioPorId);

export default router;
