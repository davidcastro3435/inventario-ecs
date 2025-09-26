// Modelo para interactuar con la base de datos PostgreSQL, tabla 'item'.
import db from '../db.js';

//Funcion para obtener todos los registros de la tabla 'item'.
export async function obtenerTodosLosItems() {
  const result = await db.query(`
    SELECT item.*, categoria.nombre AS nombre_categoria
    FROM item
    JOIN categoria ON item.id_categoria = categoria.id_categoria
  `);
  return result.rows;
}

//Funcion para obtener un item específico por su id_producto.
export async function obtenerItemPorId(id_producto) {
  const result = await db.query(`
    SELECT item.*, categoria.nombre AS nombre_categoria
    FROM item
    JOIN categoria ON item.id_categoria = categoria.id_categoria
    WHERE item.id_producto = $1
  `, [id_producto]);
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
    alarma,
  } = datosItem;

  const result = await db.query(
    `INSERT INTO item (nombre, descripcion, id_categoria, precio_unitario, stock_actual, alarma)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [nombre, descripcion, id_categoria, precio_unitario, stock_actual, alarma]
  );

  // Devuelve el item creado (incluye id_producto generado)
  return result.rows[0];
}

// Funcion para eliminar un item por id_producto
export async function eliminarItemPorId(id_producto) {
  const result = await db.query('DELETE FROM item WHERE id_producto = $1 RETURNING *', [id_producto]);
  return result.rows[0] || null;
}

// Funcion para actualizar solo el stock_actual de un item por id_producto
export async function actualizarStockPorId(id_producto, stock_actual) {
  const result = await db.query(
    `UPDATE item SET stock_actual = $1 WHERE id_producto = $2 RETURNING *`,
    [stock_actual, id_producto]
  );
  return result.rows[0] || null;
}

// Funcion para modificar un item existente por id_producto
export async function modificarItemPorId(id_producto, datosActualizados) {
  const {
    nombre,
    descripcion,
    id_categoria,
    precio_unitario,
    stock_actual,
    alarma,
  } = datosActualizados;

  const result = await db.query(
    `UPDATE item
     SET nombre = $1,
         descripcion = $2,
         id_categoria = $3,
         precio_unitario = $4,
         stock_actual = $5,
         alarma = $6
     WHERE id_producto = $7
     RETURNING *`,
    [nombre, descripcion, id_categoria, precio_unitario, stock_actual, alarma, id_producto]
  );
  return result.rows[0] || null;
}

// Obtener todos los registros de la tabla stock_mensual
export async function obtenerStockMensual() {
  const result = await db.query('SELECT * FROM stock_mensual');
  return result.rows;
}