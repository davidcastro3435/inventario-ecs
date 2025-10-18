// Controlador para la tabla categoria
import { getAllCategorias, createCategoria } from "../models/categoriaModel.js";

export const obtenerTodasCategorias = async (req, res) => {
  try {
    const categorias = await getAllCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener las categorías",
      error: error.message,
    });
  }
};

export const crearCategoria = async (req, res) => {
  try {
    const usuario = req.usuario; // Obtener usuario del token decodificado
    if (!verificarAdmin(usuario)) {
      return res.status(403).json({
        mensaje:
          "Acceso denegado: solo administradores pueden realizar esta acción.",
      });
    }

    const { nombre, descripcion } = req.body;
    if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
      return res.status(400).json({
        mensaje:
          'El campo "nombre" es obligatorio y debe ser una cadena válida',
      });
    }

    if (
      !descripcion ||
      typeof descripcion !== "string" ||
      !descripcion.trim()
    ) {
      return res.status(400).json({
        mensaje:
          'El campo "descripcion" es obligatorio y debe ser una cadena válida',
      });
    }

    const nuevaCategoria = await createCategoria(
      nombre.trim(),
      descripcion.trim(),
    );
    return res.status(201).json(nuevaCategoria);
  } catch (error) {
    // Manejar duplicado detectado por el modelo
    if (error && error.code === "DUPLICATE") {
      return res.status(409).json({ mensaje: "La categoría ya existe" });
    }

    return res
      .status(500)
      .json({ mensaje: "Error al crear la categoría", error: error.message });
  }
};

function verificarAdmin(usuario) {
  return usuario && usuario.rol === "admin";
}
