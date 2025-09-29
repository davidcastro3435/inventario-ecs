// bitacoraController.js
import { registrarMovimiento, obtenerTodosLosMovimientos, obtenerMovimientosPorUsuario } from '../models/movimientoModel.js';

export async function getMovimientos(req, res) {
  try {
    const usuario = req.usuario;
    let movimientos;
    if (usuario && usuario.rol !== 'admin') {
      movimientos = await obtenerMovimientosPorUsuario(usuario.id);
    } else {
      movimientos = await obtenerTodosLosMovimientos();
    }

    res.json(movimientos);
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({ mensaje: 'Error al obtener movimientos' });
  }
}

// Función para registrar un movimiento en la bitácora
export async function registrarMovimientoBitacora({ id_producto, id_usuario, nombre, stock_db, stock_actual }) {
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