import express from 'express';
import { getMovimientos } from '../controllers/bitacoraController.js';

const router = express.Router();

// Ruta para obtener todos los movimientos
router.get('/all', getMovimientos);

export default router;
