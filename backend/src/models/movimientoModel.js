// Modelo para la tabla movimiento
import db from '../db.js';

export async function registrarMovimiento({ id_producto, id_usuario, descripcion, cantidad, tipo }) {
  const result = await db.query(
    `INSERT INTO movimiento (id_producto, id_usuario, fecha_movimiento, descripcion, cantidad, tipo)
     VALUES ($1, $2, NOW(), $3, $4, $5) RETURNING *`,
    [id_producto, id_usuario, descripcion, cantidad, tipo]
  );
  return result.rows[0];
}

export async function eliminarMovimientosPorProducto(id_producto) {
  await db.query('DELETE FROM movimiento WHERE id_producto = $1', [id_producto]);
}

export async function obtenerTodosLosMovimientos() {
  const result = await db.query('SELECT m.*, p.nombre AS nombre_producto, u.nombre AS nombre_usuario FROM movimiento m JOIN item p ON m.id_producto = p.id_producto JOIN usuario u ON m.id_usuario = u.id_usuario ORDER BY m.fecha_movimiento DESC');
  return result.rows;
}

// Obtener movimientos filtrados por id_usuario
export async function obtenerMovimientosPorUsuario(id_usuario) {
  const result = await db.query(`
    SELECT m.*, p.nombre AS nombre_producto, u.nombre AS nombre_usuario
    FROM movimiento m
    JOIN item p ON m.id_producto = p.id_producto
    JOIN usuario u ON m.id_usuario = u.id_usuario
    WHERE m.id_usuario = $1
    ORDER BY m.fecha_movimiento DESC
  `, [id_usuario]);
  return result.rows;
}