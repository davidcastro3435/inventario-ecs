// bitacoraService.js
// Lógica para conectar con el API de bitácora

function getAuthHeaders() {
	const token = localStorage.getItem('token');
	if (token) {
		return { 'Authorization': 'Bearer ' + token };
	}
	return {};
}

export async function obtenerMovimientosAPI() {
	const response = await fetch('http://localhost:3000/bitacora/movimientos', {
		headers: {
			...getAuthHeaders()
		}
	});
	if (!response.ok) throw new Error('Error al obtener la bitácora');
	return await response.json();
}
