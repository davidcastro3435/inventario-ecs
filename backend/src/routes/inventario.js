// Rutas para manejar las operaciones relacionadas con 'item' en el inventario

import express from 'express';
import { getItems, getItemPorId, postItem, deleteItem, patchItem, patchStockItem, getStockMensual } from '../controllers/inventarioController.js';

const router = express.Router();

// Ruta para obtener todos los items de la base de datos
router.get('/items', getItems);

// Ruta para obtener un item específico por id_producto
router.get('/items/:id_producto', getItemPorId);

// Ruta para crear un nuevo item en la base de datos
router.post('/items', postItem);

// Ruta para eliminar un item por id_producto
router.delete('/items/:id_producto', deleteItem);

// Ruta para modificar un item existente por id_producto (PATCH)
router.patch('/items/:id_producto', patchItem);

// Ruta para actualizar solo el stock_actual de un item
router.patch('/items/stock/:id_producto', patchStockItem);

// Ruta para obtener todos los registros de la tabla stock_mensual
router.get('/items/stock/mes', getStockMensual);

export default router;