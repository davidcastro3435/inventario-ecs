// Controlador para autenticación de usuario
import { findUserByNombre, createUser } from '../models/usuarioModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_predeterminado';

export async function loginUsuario(req, res) {
  const { nombre, contrasena } = req.body;
  if (!nombre || !contrasena) {
    return res.status(400).json({ mensaje: 'Nombre y contraseña requeridos' });
  }
  try {
    const usuario = await findUserByNombre(nombre);
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordMatch) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ token, id: usuario.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

// Registrar usuario

export async function registrarUsuario(req, res) {
  const { nombre, correo, contrasena, rol } = req.body;
  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Nombre, correo y contraseña requeridos' });
  }
  try {
    const existente = await findUserByNombre(nombre);
    if (existente) {
      return res.status(409).json({ mensaje: 'El usuario ya existe' });
    }
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = await createUser({ nombre, correo, contrasena: hashedPassword, rol });
    res.status(201).json({ mensaje: 'Usuario registrado', usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, correo: nuevoUsuario.correo, rol: nuevoUsuario.rol } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}