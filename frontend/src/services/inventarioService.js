// inventarioService.js
// Lógica para conectar con el API de inventario

export async function obtenerInventarioAPI() {
  const response = await fetch('http://localhost:3000/inventario/items');
  if (!response.ok) throw new Error('Error al obtener inventario');
  return await response.json();
}
