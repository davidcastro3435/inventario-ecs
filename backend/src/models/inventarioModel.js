// Modelo para interactuar con la base de datos PostgreSQL, tabla 'item'.
import db from '../db.js';

//Funcion para obtener todos los registros de la tabla 'item'.
export async function obtenerTodosLosItems() {
  const result = await db.query('SELECT * FROM item');
  return result.rows;
}

//Funcion para obtener un item específico por su id_producto.
export async function obtenerItemPorId(id_producto) {
  const result = await db.query('SELECT * FROM item WHERE id_producto = $1', [id_producto]);
  return result.rows[0] || null;
}

// Funcion para crear un nuevo item en la base de datos.
export async function crearItem(datosItem) {
  // Campos según la estructura real de la tabla 'item'
  const {
    nombre,
    descripcion,
    id_categoria,
    precio_unitario,
    stock_actual,
    fecha_registro,
    estado
  } = datosItem;

  const result = await db.query(
    `INSERT INTO item (nombre, descripcion, id_categoria, precio_unitario, stock_actual, fecha_registro, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [nombre, descripcion, id_categoria, precio_unitario, stock_actual, fecha_registro, estado]
  );

  // Devuelve el item creado (incluye id_producto generado)
  return result.rows[0];
}