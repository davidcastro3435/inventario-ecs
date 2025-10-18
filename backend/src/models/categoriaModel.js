// Modelo para la tabla categoria
import pool from "../db.js";

export const getAllCategorias = async () => {
  const query = "SELECT id_categoria, nombre, descripcion FROM categoria";
  const { rows } = await pool.query(query);
  return rows;
};

/**
 * Crea una nueva categoría comprobando duplicados por nombre (case-insensitive).
 * @param {string} nombre
 * @param {string} descripcion
 * @returns {Object} la fila creada { id_categoria, nombre, descripcion }
 * @throws {Error} con `error.code === 'DUPLICATE'` si ya existe una categoría con el mismo nombre
 */
export const createCategoria = async (nombre, descripcion) => {
  // Validar parámetros a nivel de modelo (se asume validación principal en controller)
  const nombreTrim = nombre ? String(nombre).trim() : "";
  const descripcionTrim = descripcion ? String(descripcion).trim() : "";

  // Comprobar duplicado (case-insensitive)
  const checkQuery =
    "SELECT id_categoria FROM categoria WHERE LOWER(nombre) = LOWER($1)";
  const { rows: existing } = await pool.query(checkQuery, [nombreTrim]);
  if (existing.length > 0) {
    const error = new Error("Categoria ya existe");
    error.code = "DUPLICATE";
    throw error;
  }

  // Insertar y devolver la fila creada (incluye descripcion)
  const insertQuery =
    "INSERT INTO categoria (nombre, descripcion) VALUES ($1, $2) RETURNING id_categoria, nombre, descripcion";
  const values = [nombreTrim, descripcionTrim];
  const { rows } = await pool.query(insertQuery, values);
  return rows[0];
};
