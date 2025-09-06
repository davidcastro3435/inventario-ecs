// bitacoraController.js
import { obtenerTodosLosMovimientos } from '../models/movimientoModel.js';

export async function getMovimientos(req, res) {
  try {
    const movimientos = await obtenerTodosLosMovimientos();
    res.json(movimientos);
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({ mensaje: 'Error al obtener movimientos' });
  }
}
