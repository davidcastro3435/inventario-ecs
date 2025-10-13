import express from 'express';
import { loginUsuario, registrarUsuario, actualizarContrasenaUsuario, actualizarCorreoUsuario } from '../controllers/usuarioController.js';

const router = express.Router();


// Ruta para login de usuario
router.post('/login', loginUsuario);

// Ruta para registrar usuario
router.post('/register', registrarUsuario);

router.patch('/datos/contrasena', actualizarContrasenaUsuario);

router.patch('/datos/correo', actualizarCorreoUsuario);

export default router;
