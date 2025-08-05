// Rutas para manejar las operaciones relacionadas con 'item' en el inventario

import express from 'express';
import { getItems, getItemPorId, postItem } from '../controllers/inventarioController.js';

const router = express.Router();

// Ruta para obtener todos los items de la base de datos
router.get('/items', getItems);

// Ruta para obtener un item específico por id_producto
router.get('/items/:id_producto', getItemPorId);

// Ruta para crear un nuevo item en la base de datos
router.post('/items', postItem);

export default router;