import express from 'express';
import { getItems } from '../controllers/inventarioController.js';

const router = express.Router();

// Ruta para obtener todos los items de la base de datos
// GET /inventario/items
router.get('/items', getItems);

export default router;