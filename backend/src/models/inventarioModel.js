// Modelo para interactuar con la base de datos MySQL, tabla 'item'.
import db from '../db.js';

//Funcion para obtener todos los registros de la tabla 'item'.
export async function obtenerTodosLosItems() {
  const [rows] = await db.query('SELECT * FROM inventory_system.item');
  return rows;
}

//Funcion para obtener un item específico por su id_producto.
export async function obtenerItemPorId(id_producto) {
  const [rows] = await db.query('SELECT * FROM inventory_system.item WHERE id_producto = ?', [id_producto]);
  return rows[0] || null;
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
    estado
  } = datosItem;

  const [result] = await db.query(
    'INSERT INTO inventory_system.item (nombre, descripcion, id_categoria, precio_unitario, stock_actual, estado) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, descripcion, id_categoria, precio_unitario, stock_actual, estado]
  );

  // Devuelve el item creado con el id generado
  return {
    id_producto: result.insertId,
    nombre,
    descripcion,
    id_categoria,
    precio_unitario,
    stock_actual,
    fecha_registro,
    estado
  };
}