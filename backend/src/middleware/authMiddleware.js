// Middleware para proteger rutas con JWT
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_predeterminado';

export function authMiddleware(req, res, next) {
  // Permitir acceso libre a la ruta de login
  if (req.path === '/usuario/login' && req.method === 'POST' || req.path === '/usuario/register' && req.method === 'POST') {
    return next();
  }

  // Obtener el token del header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
}
