import express from 'express';
import { loginUsuario } from '../controllers/usuarioController.js';

const router = express.Router();

// Ruta para login de usuario
router.post('/login', loginUsuario);

export default router;
