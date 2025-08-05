// inventarioModel.js
// Modelo para interactuar con la base de datos MySQL, tabla 'item'.
// Aquí se define la función para obtener todos los registros de la tabla 'item'.

import db from '../db.js';

/**
 * Obtiene todos los registros de la tabla 'item'.
 * @returns {Promise<Array>} Lista de items.
 */
export async function obtenerTodosLosItems() {
  const [rows] = await db.query('SELECT * FROM inventory_system.item');
  return rows;
}
