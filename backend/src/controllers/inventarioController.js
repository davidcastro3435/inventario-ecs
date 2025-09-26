// Controlador para manejar la lógica relacionada con la tabla 'item'.

import { obtenerTodosLosItems, obtenerItemPorId, crearItem, eliminarItemPorId, modificarItemPorId, actualizarStockPorId, obtenerStockMensual } from '../models/inventarioModel.js';
import { registrarMovimiento, eliminarMovimientosPorProducto } from '../models/movimientoModel.js';

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
  const usuario = req.usuario; // Obtener usuario del token decodificado
  try {
    if (!usuario || usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado: solo administradores pueden realizar esta acción.' });
    }

    const datosItem = req.body;
    const { id_usuario } = req.body; // id_usuario debe venir en el body
    const itemCreado = await crearItem(datosItem);

    // Registrar movimiento de entrada
    if (itemCreado && id_usuario) {
      const descripcion = `Se añadieron ${itemCreado.stock_actual} unidades de ${itemCreado.nombre}.`;
      await registrarMovimiento({
        id_producto: itemCreado.id_producto,
        id_usuario,
        descripcion,
        cantidad: itemCreado.stock_actual,
        tipo: 'entrada'
      });
    }
    res.status(201).json(itemCreado);
  } catch (error) {
    console.error('Error al crear el item:', error);
    res.status(500).json({ mensaje: 'Error al crear el item' });
  }
}

// Funcion para eliminar un item por id_producto
export async function deleteItem(req, res) {
  const usuario = req.usuario; // Obtener usuario del token decodificado
  try {
    if (!usuario || usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado: solo administradores pueden realizar esta acción.' });
    }
    const { id_producto } = req.params;
    await eliminarMovimientosPorProducto(id_producto);
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
  const usuario = req.usuario; // Obtener usuario del token decodificado
  try {
    if (!usuario || usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado: solo administradores pueden realizar esta acción.' });
    }
    const { id_producto } = req.params;
    const { nombre, descripcion, id_categoria, precio_unitario, stock_actual, id_usuario } = req.body;

    // Validación básica
    if (!nombre || !descripcion || !id_categoria || precio_unitario === undefined || stock_actual === undefined) {
      return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
    }

    // Verifica que el item exista
    const existente = await obtenerItemPorId(id_producto);
    if (!existente) {
      return res.status(404).json({ mensaje: 'Item no encontrado' });
    }

    // Guardar el stock actual de la base de datos antes de modificar
    const stock_db = existente.stock_actual;

    const actualizado = await modificarItemPorId(id_producto, {
      nombre,
      descripcion,
      id_categoria,
      precio_unitario,
      stock_actual,
    });

    // Registrar movimiento si hay id_usuario
    if (id_usuario) {
      let descripcionMovimiento = '';
      let cantidadMovimiento = 0;
      if (stock_actual < stock_db) {
        descripcionMovimiento = `Se disminuyó la cantidad de ${nombre} de ${stock_db} a ${stock_actual}`;
        cantidadMovimiento = stock_db - stock_actual;
      } else if (stock_actual > stock_db) {
        descripcionMovimiento = `Se aumentó la cantidad de ${nombre} de ${stock_db} a ${stock_actual}`;
        cantidadMovimiento = stock_actual - stock_db;
      } else {
        descripcionMovimiento = `Se cambiaron datos del producto ${nombre}`;
        cantidadMovimiento = 0;
      }
      await registrarMovimiento({
        id_producto,
        id_usuario,
        descripcion: descripcionMovimiento,
        cantidad: cantidadMovimiento,
        tipo: 'ajuste'
      });
    }

    res.json(actualizado);
  } catch (error) {
    console.error('Error al modificar el item:', error);
    res.status(500).json({ mensaje: 'Error al modificar el item' });
  }
}

// PATCH solo para actualizar el stock_actual de un item
export async function patchStockItem(req, res) {
  try {
    const { id_producto } = req.params;
    const { stock_actual } = req.body;
    if (stock_actual === undefined) {
      return res.status(400).json({ mensaje: 'El campo stock_actual es requerido' });
    }
    // Verifica que el item exista
    const existente = await obtenerItemPorId(id_producto);
    if (!existente) {
      return res.status(404).json({ mensaje: 'Item no encontrado' });
    }
    const actualizado = await actualizarStockPorId(id_producto, stock_actual);
    res.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar el stock:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el stock' });
  }
}

// Obtener todos los registros de la tabla stock_mensual
export async function getStockMensual(req, res) {
  try {
    const stockMensual = await obtenerStockMensual();
    res.json(stockMensual);
  } catch (error) {
    console.error('Error al obtener stock mensual:', error);
    res.status(500).json({ mensaje: 'Error al obtener stock mensual' });
  }
}