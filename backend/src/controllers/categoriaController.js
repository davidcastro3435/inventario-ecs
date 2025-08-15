// Controlador para la tabla categoria
import { getAllCategorias } from '../models/categoriaModel.js';


export const obtenerTodasCategorias = async (req, res) => {
  try {
    const categorias = await getAllCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las categorías', error: error.message });
  }
};
