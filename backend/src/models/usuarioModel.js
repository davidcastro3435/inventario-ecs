// Modelo para la tabla usuario
import pool from '../db.js';

export async function findUserByNombre(nombre) {
  const query = 'SELECT * FROM usuario WHERE nombre = $1';
  const values = [nombre];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

// Registrar un nuevo usuario

export async function createUser({ nombre, correo, contrasena, rol = 'usuario' }) {
  const query = 'INSERT INTO usuario (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [nombre, correo, contrasena, rol];
  const { rows } = await pool.query(query, values);
  return rows[0];
}
