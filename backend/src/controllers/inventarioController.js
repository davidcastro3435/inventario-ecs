// Controlador para manejar la lógica relacionada con la tabla 'item'.

import { obtenerTodosLosItems, obtenerItemPorId, crearItem } from '../models/inventarioModel.js';

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
