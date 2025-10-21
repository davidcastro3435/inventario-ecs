// Modelo para la tabla usuario
import pool from "../db.js";

// Encontrar usuario por nombre
export async function findUserByNombre(nombre) {
  const query = "SELECT * FROM usuario WHERE nombre = $1";
  const values = [nombre];
  const { rows } = await pool.query(query, values);

  return rows[0];
}

// Registrar un nuevo usuario
export async function createUser({
  nombre,
  correo,
  contrasena,
  rol = "usuario",
}) {
  const query =
    "INSERT INTO usuario (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING *";
  const values = [nombre, correo, contrasena, rol];
  const { rows } = await pool.query(query, values);

  return rows[0];
}

// Obtener lista básica de todos los usuarios (id, nombre, correo, rol, ultimo_acceso)
export async function getAllUsersBasic() {
  const query =
    "SELECT id_usuario, nombre, correo, rol, ultimo_acceso FROM usuario";
  const { rows } = await pool.query(query);
  return rows;
}

// Actualizar el campo ultimo_acceso del usuario a la hora actual
export async function updateLastAccessById(id_usuario) {
  const query =
    "UPDATE usuario SET ultimo_acceso = NOW() WHERE id_usuario = $1 RETURNING *";
  const values = [id_usuario];
  const { rows } = await pool.query(query, values);

  return rows[0];
}

// Obtener todos los correos de usuarios cuyo rol sea 'admin'
export async function obtenerCorreosAdmins() {
  const query = "SELECT correo FROM usuario WHERE rol = $1";
  const values = ["admin"];
  const { rows } = await pool.query(query, values);

  return rows.map((row) => row.correo);
}

// Actualizar contraseña de usuario por id
export async function updateUserPasswordById(id_usuario, nuevaContrasenaHash) {
  const query =
    "UPDATE usuario SET contrasena = $1 WHERE id_usuario = $2 RETURNING *";
  const values = [nuevaContrasenaHash, id_usuario];
  const { rows } = await pool.query(query, values);

  return rows[0];
}

// Actualizar correo de usuario por id
export async function updateUserEmailById(id_usuario, nuevoCorreo) {
  const query =
    "UPDATE usuario SET correo = $1 WHERE id_usuario = $2 RETURNING *";
  const values = [nuevoCorreo, id_usuario];
  const { rows } = await pool.query(query, values);

  return rows[0];
}

// Funcion para eliminar un usuario por id
export async function deleteUserById(id_usuario) {
  const result = await pool.query(
    "DELETE FROM usuario WHERE id_usuario = $1 RETURNING *",
    [id_usuario],
  );
  return result.rows[0] || null;
}
