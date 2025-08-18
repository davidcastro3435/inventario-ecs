// Controlador para manejar la lógica relacionada con la tabla 'item'.

import { obtenerTodosLosItems, obtenerItemPorId, crearItem, eliminarItemPorId, modificarItemPorId } from '../models/inventarioModel.js';

// Funcion para obtener todos los items
export async function getItems(req, res) {
  try {
    const items = await obtenerTodosLosItems();
    res.json(items);
  } catch (error) {
    console.error('Error al obtener los items:', error);
    res.status(500).json({ mensaje: 'Error al obtener los items' });
  }
}

// Funcion para obtener un item específico por su id_producto
export async function getItemPorId(req, res) {
  try {
    const { id_producto } = req.params;
    const item = await obtenerItemPorId(id_producto);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ mensaje: 'Item no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el item:', error);
    res.status(500).json({ mensaje: 'Error al obtener el item' });
  }
}

// Funcion para crear un nuevo item en la base de datos
export async function postItem(req, res) {
  try {
    const datosItem = req.body;
    const itemCreado = await crearItem(datosItem);
    res.status(201).json(itemCreado);
  } catch (error) {
    console.error('Error al crear el item:', error);
    res.status(500).json({ mensaje: 'Error al crear el item' });
  }
}

// Funcion para eliminar un item por id_producto
export async function deleteItem(req, res) {
  try {
    const { id_producto } = req.params;
    const itemEliminado = await eliminarItemPorId(id_producto);
    if (itemEliminado) {
      res.json({ mensaje: 'Item eliminado correctamente', item: itemEliminado });
    } else {
      res.status(404).json({ mensaje: 'Item no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el item:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el item' });
  }
}
// Funcion para modificar un item existente por id_producto (PATCH)
export async function patchItem(req, res) {
  try {
    const { id_producto } = req.params;
    const { nombre, descripcion, id_categoria, precio_unitario, stock_actual } = req.body;

    // Validación básica
    if (!nombre || !descripcion || !id_categoria || precio_unitario === undefined || stock_actual === undefined) {
      return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
    }

    // Verifica que el item exista
    const existente = await obtenerItemPorId(id_producto);
    if (!existente) {
      return res.status(404).json({ mensaje: 'Item no encontrado' });
    }

    const actualizado = await modificarItemPorId(id_producto, {
      nombre,
      descripcion,
      id_categoria,
      precio_unitario,
      stock_actual,
    });

    res.json(actualizado);
  } catch (error) {
    console.error('Error al modificar el item:', error);
    res.status(500).json({ mensaje: 'Error al modificar el item' });
  }
}