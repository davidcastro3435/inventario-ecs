// inventarioController.js
// Controlador para manejar la lógica de negocio relacionada con 'item'.

import { obtenerTodosLosItems } from '../models/inventarioModel.js';

/**
 * Controlador para obtener todos los items de la base de datos.
 * Responde con un array de items en formato JSON.
 * @param {Request} req - Objeto de solicitud HTTP
 * @param {Response} res - Objeto de respuesta HTTP
 */
export async function getItems(req, res) {
  try {
    const items = await obtenerTodosLosItems();
    res.json(items);
  } catch (error) {
    console.error('Error al obtener los items:', error);
    res.status(500).json({ mensaje: 'Error al obtener los items' });
  }
}
