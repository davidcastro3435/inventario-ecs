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