import express from 'express';
import { loginUsuario, registrarUsuario } from '../controllers/usuarioController.js';

const router = express.Router();


// Ruta para login de usuario
router.post('/login', loginUsuario);

// Ruta para registrar usuario
router.post('/register', registrarUsuario);

export default router;
