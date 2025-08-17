// inventario.js
// Obtiene los datos del inventario desde el API y los muestra en la tabla de inventory.html

import { obtenerInventarioAPI, obtenerCategoriasAPI, crearItemAPI, eliminarItemAPI, patchItemAPI } from '../services/inventarioService.js';
import { mostrarModalEliminar } from './modals/modalEliminar.js';
import { inicializarModalCrear } from './modals/modalCrear.js';
import { mostrarModalModificar } from './modals/modalModificar.js';

// Función para obtener los items del API usando el service
async function obtenerInventario() {
	try {
		const items = await obtenerInventarioAPI();
		mostrarInventario(items);
	} catch (error) {
		console.error(error);
		mostrarError('No se pudo cargar el inventario');
	}
}

// Función para mostrar los items en la tabla
function mostrarInventario(items) {
	const tbody = document.querySelector('.inventory-table tbody');
	tbody.innerHTML = '';
	items.forEach(item => {
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${item.id_producto}</td>
			<td>${item.nombre}</td>
			<td>${item.descripcion}</td>
			<td>${item.nombre_categoria}</td>
			<td>${item.stock_actual}</td>
			<td>
				<button class="action-btn btn-modificar" title="Modificar" data-id="${item.id_producto}">M</button>
				<button class="action-btn btn-eliminar" title="Eliminar" data-id="${item.id_producto}">E</button>
			</td>
		`;
		tbody.appendChild(tr);
	});
}

// Función para mostrar errores en la tabla
function mostrarError(mensaje) {
	const tbody = document.querySelector('.inventory-table tbody');
	tbody.innerHTML = `<tr><td colspan="6" style="color:red;text-align:center;">${mensaje}</td></tr>`;
}

// Delegación de eventos para los botones de acción y modal
document.addEventListener('DOMContentLoaded', () => {
	obtenerInventario();
	const tbody = document.querySelector('.inventory-table tbody');
	tbody.addEventListener('click', async (e) => {
		if (e.target.classList.contains('btn-modificar')) {
			const id = e.target.getAttribute('data-id');
			// Buscar el item en la tabla actual
			const items = await obtenerInventarioAPI();
			const item = items.find(i => String(i.id_producto) === String(id));
			if (item) {
				mostrarModalModificar({
					item,
					patchItemAPI,
					refrescarTabla: obtenerInventario
				});
			} else {
				alert('No se encontró el item.');
			}
		}
		if (e.target.classList.contains('btn-eliminar')) {
			const id = e.target.getAttribute('data-id');
			mostrarModalEliminar(id, eliminarItemAPI, obtenerInventario);
		}
	});

	// Modal crear item
	inicializarModalCrear({
		btnCreate: document.querySelector('.btn-create'),
		modalOverlay: document.getElementById('modal-create-overlay'),
		modalForm: document.getElementById('modal-create-form'),
		btnDiscard: document.getElementById('modal-create-overlay').querySelector('.btn-discard'),
		categoriaSelect: document.getElementById('modal-categoria'),
		obtenerCategoriasAPI,
		crearItemAPI,
		refrescarTabla: obtenerInventario
	});
});

