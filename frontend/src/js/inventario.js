// inventario.js
// Obtiene los datos del inventario desde el API y los muestra en la tabla de inventory.html

import { obtenerInventarioAPI } from '../services/inventarioService.js';

import { obtenerCategoriasAPI } from '../services/inventarioService.js';

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
	tbody.addEventListener('click', (e) => {
		if (e.target.classList.contains('btn-modificar')) {
			const id = e.target.getAttribute('data-id');
			alert(`modificar item :${id}`);
		}
		if (e.target.classList.contains('btn-eliminar')) {
			const id = e.target.getAttribute('data-id');
			alert(`eliminar item :${id}`);
		}
	});

	// Modal lógica
	const btnCreate = document.querySelector('.btn-create');
	const modalOverlay = document.getElementById('modal-create-overlay');
	const modalForm = document.getElementById('modal-create-form');
	const btnDiscard = modalOverlay.querySelector('.btn-discard');
	const categoriaSelect = document.getElementById('modal-categoria');

	btnCreate.addEventListener('click', async () => {
		modalOverlay.style.display = 'flex';
		// Cargar categorías
		categoriaSelect.innerHTML = '<option value="">Cargando...</option>';
		try {
			const categorias = await obtenerCategoriasAPI();
			categoriaSelect.innerHTML = '<option value="">Seleccione una categoría</option>';
			categorias.forEach(cat => {
				const opt = document.createElement('option');
				opt.value = cat.id_categoria || cat.id || cat.nombre; // fallback
				opt.textContent = cat.nombre;
				categoriaSelect.appendChild(opt);
			});
		} catch (e) {
			categoriaSelect.innerHTML = '<option value="">Error al cargar</option>';
		}
	});

	btnDiscard.addEventListener('click', () => {
		modalOverlay.style.display = 'none';
		modalForm.reset();
	});

	// Cerrar modal al hacer click fuera del cuadro
	modalOverlay.addEventListener('click', (e) => {
		if (e.target === modalOverlay) {
			modalOverlay.style.display = 'none';
			modalForm.reset();
		}
	});

	// Guardar (por ahora solo cierra el modal y resetea)
	modalForm.addEventListener('submit', (e) => {
		e.preventDefault();
		// Aquí iría la lógica para guardar el item
		modalOverlay.style.display = 'none';
		modalForm.reset();
		// Puedes mostrar un mensaje de éxito aquí
	});
});

