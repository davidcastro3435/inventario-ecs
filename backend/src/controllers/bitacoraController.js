// bitacoraController.js
import { obtenerTodosLosMovimientos, obtenerMovimientosPorUsuario } from '../models/movimientoModel.js';

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
