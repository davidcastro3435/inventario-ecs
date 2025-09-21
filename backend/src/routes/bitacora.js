import express from 'express';
import { getMovimientos } from '../controllers/bitacoraController.js';

const router = express.Router();

// Ruta para obtener los movimientos (admin: todos, otros: solo propios)
router.get('/movimientos', getMovimientos);

export default router;
