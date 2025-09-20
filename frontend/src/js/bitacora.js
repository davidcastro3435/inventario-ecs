// bitacora.js
// Obtiene los datos de la bitacora desde el API y los muestra en la tabla de bitacora.html

import { obtenerMovimientosAPI } from '../services/bitacoraService.js';

// Función para cargar los movimientos de la bitácora
async function cargarBitacora() {
	try {
		const movimientos = await obtenerMovimientosAPI();
		renderizarTablaBitacora(movimientos);
	} catch (err) {
		alert('No se pudo cargar la bitácora');
	}
}

// Función para renderizar la tabla
function renderizarTablaBitacora(movimientos) {
	const tbody = document.querySelector('.bitacora-table tbody');
	tbody.innerHTML = '';
	movimientos.forEach(mov => {
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${new Date(mov.fecha_movimiento || mov.fecha).toLocaleString()}</td>
			<td>${mov.nombre_usuario || ''}</td>
			<td>${mov.nombre_producto || ''}</td>
			<td>${mov.tipo || ''}</td>
			<td>${mov.descripcion || ''}</td>
			<td>${mov.cantidad ?? ''}</td>
		`;
		tbody.appendChild(tr);
	});
}

// Cargar la bitácora al iniciar la página
document.addEventListener('DOMContentLoaded', cargarBitacora);
