// Modelo para la tabla usuario
import pool from '../db.js';

export async function findUserByNombre(nombre) {
  const query = 'SELECT * FROM usuario WHERE nombre = $1';
  const values = [nombre];
  const { rows } = await pool.query(query, values);
  return rows[0];
}
