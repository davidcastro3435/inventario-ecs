// Controlador para autenticación de usuario
import {
  findUserByNombre,
  createUser,
  updateUserPasswordById,
  updateUserEmailById,
  getAllUsersBasic,
  updateLastAccessById,
} from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secreto_predeterminado";

export async function loginUsuario(req, res) {
  const { nombre, contrasena } = req.body;
  if (!nombre || !contrasena) {
    return res.status(400).json({ mensaje: "Nombre y contraseña requeridos" });
  }

  try {
    const usuario = await findUserByNombre(nombre);
    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordMatch) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // Actualizar ultimo_acceso al momento del login
    try {
      await updateLastAccessById(usuario.id_usuario);
    } catch (updateErr) {
      // No abortamos el login si la actualización falla; solo logueamos el error.
      console.error("Error actualizando ultimo_acceso:", updateErr);
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.json({ token, id: usuario.id_usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
}

// Registrar usuario

export async function registrarUsuario(req, res) {
  const { nombre, correo, contrasena, rol } = req.body;
  if (!nombre || !correo || !contrasena) {
    return res
      .status(400)
      .json({ mensaje: "Nombre, correo y contraseña requeridos" });
  }

  try {
    const existente = await findUserByNombre(nombre);
    if (existente) {
      return res.status(409).json({ mensaje: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = await createUser({
      nombre,
      correo,
      contrasena: hashedPassword,
      rol,
    });

    res
      .status(201)
      .json({
        mensaje: "Usuario registrado",
        usuario: {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          correo: nuevoUsuario.correo,
          rol: nuevoUsuario.rol,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
}

// Obtener lista de todos los usuarios (solo administradores)
export async function obtenerUsuarios(req, res) {
  try {
    const usuarioToken = req.usuario;
    if (!usuarioToken || usuarioToken.rol !== "admin") {
      return res
        .status(403)
        .json({
          mensaje:
            "Acceso denegado: solo administradores pueden ver la lista de usuarios",
        });
    }

    const usuarios = await getAllUsersBasic();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
}

// PATCH /datos/contrasena
export async function actualizarContrasenaUsuario(req, res) {
  try {
    // Obtener el id del usuario desde el token decodificado (middleware debe poner req.usuario)
    const usuarioToken = req.usuario;
    if (!usuarioToken || !usuarioToken.id) {
      return res
        .status(401)
        .json({ mensaje: "Token inválido o usuario no autenticado" });
    }

    const { nuevaContrasena } = req.body;
    if (!nuevaContrasena) {
      return res.status(400).json({ mensaje: "Nueva contraseña requerida" });
    }

    // Buscar usuario en la base de datos
    const hash = await bcrypt.hash(nuevaContrasena, 10);
    const usuarioActualizado = await updateUserPasswordById(
      usuarioToken.id,
      hash,
    );
    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
}

// PATCH /datos/correo
export async function actualizarCorreoUsuario(req, res) {
  try {
    const usuarioToken = req.usuario;
    if (!usuarioToken || !usuarioToken.id) {
      return res
        .status(401)
        .json({ mensaje: "Token inválido o usuario no autenticado" });
    }

    const { nuevoCorreo } = req.body;
    if (!nuevoCorreo) {
      return res.status(400).json({ mensaje: "Nuevo correo requerido" });
    }

    const usuarioActualizado = await updateUserEmailById(
      usuarioToken.id,
      nuevoCorreo,
    );
    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Correo actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
}
