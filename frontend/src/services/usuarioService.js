// usuarioService.js
// Lógica para conectar con el API de usuario

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (token) {
    return { 'Authorization': 'Bearer ' + token };
  }
  return {};
}

// Funcion para actualizar contraseña del usuario
export async function patchContrasenaUsuario(id, data) {
  const userId = localStorage.getItem('userId');
  const response = await fetch(`http://localhost:3000/usuario/datos/contrasena`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ ...data, id_usuario: userId }),
  });
  if (!response.ok) throw new Error('Error al modificar la contraseña del usuario');
  return await response.json();
}

// Funcion para actualizar correo del usuario
export async function patchCorreoUsuario(id, data) {
  const userId = localStorage.getItem('userId');
  const response = await fetch(`http://localhost:3000/usuario/datos/correo`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ ...data, id_usuario: userId }),
  });
  if (!response.ok) throw new Error('Error al modificar el correo del usuario');
  return await response.json();
}