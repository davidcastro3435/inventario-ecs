// inventarioService.js
// Lógica para conectar con el API de inventario

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (token) {
    return { 'Authorization': 'Bearer ' + token };
  }
  return {};
}

export async function obtenerInventarioAPI() {
  const response = await fetch('http://localhost:3000/inventario/items', {
    headers: {
      ...getAuthHeaders()
    }
  });
  if (!response.ok) throw new Error('Error al obtener inventario');
  return await response.json();
}


export async function obtenerCategoriasAPI() {
  const response = await fetch('http://localhost:3000/categoria/all', {
    headers: {
      ...getAuthHeaders()
    }
  });
  if (!response.ok) throw new Error('Error al obtener categorías');
  return await response.json();
}


export async function crearItemAPI(data) {
  const response = await fetch('http://localhost:3000/inventario/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear el item');
  return await response.json();
}

// Lógica para eliminar un item del inventario
export async function eliminarItemAPI(id) {
  const response = await fetch(`http://localhost:3000/inventario/items/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders()
    }
  });
  if (!response.ok) throw new Error('Error al eliminar el item');
  return await response.json();
}

// Lógica para modificar un item del inventario (PATCH)
export async function patchItemAPI(id, data) {
  const response = await fetch(`http://localhost:3000/inventario/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al modificar el item');
  return await response.json();
}