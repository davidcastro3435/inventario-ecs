// Modelo para la tabla categoria
import pool from '../db.js';

export const getAllCategorias = async () => {
  const query = 'SELECT id_categoria, nombre FROM categoria';
  const { rows } = await pool.query(query);
  return rows;
};
