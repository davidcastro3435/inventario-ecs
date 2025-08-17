// Controlador para autenticación de usuario
import { findUserByNombre } from '../models/usuarioModel.js';
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
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}
