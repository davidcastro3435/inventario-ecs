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
			<td class="d-flex gap-1">
				<button class="btn btn-success btn-sm action-btn btn-add" title="Agregar" data-id="${item.id_producto}"><i class="bi bi-plus-lg"></i></button>
				<button class="btn btn-secondary btn-sm action-btn btn-subtract" title="Quitar" data-id="${item.id_producto}"><i class="bi bi-dash-lg"></i></button>
				<button class="btn btn-primary btn-sm action-btn btn-modificar" title="Modificar" data-id="${item.id_producto}"><i class="bi bi-pencil-square"></i></button>
				<button class="btn btn-danger btn-sm action-btn btn-eliminar" title="Eliminar" data-id="${item.id_producto}"><i class="bi bi-trash-fill"></i></button>
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
/*
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
	*/
});


// Mostrar offcanvas al hacer click en btn-create
document.addEventListener('DOMContentLoaded', function() {
	const btnCreate = document.getElementById('btn-create');
	if (btnCreate) {
		btnCreate.addEventListener('click', function() {
			const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasCreateItem'));
			offcanvas.show();
		});
	}

	// Llenar el dropdown de categorías usando obtenerCategoriasAPI y JWT
	const categoriaSelect = document.getElementById('item-categoria');
	if (categoriaSelect) {
		obtenerCategoriasAPI()
			.then(data => {
				// Limpiar opciones previas excepto la primera
				categoriaSelect.innerHTML = '<option value="" disabled selected>Seleccione una categoría</option>';
				if (Array.isArray(data)) {
					data.forEach(cat => {
						const option = document.createElement('option');
						option.value = cat.id_categoria || cat._id || cat.id || cat.nombre;
						option.textContent = cat.nombre;
						categoriaSelect.appendChild(option);
					});
				}
			})
			.catch(err => {
				categoriaSelect.innerHTML = '<option value="" disabled selected>No se pudieron cargar categorías</option>';
			});
	}

	// Validar cantidad (solo int) y precio (float) y crear el item por API
	const form = document.getElementById('form-create-item');
	if (form) {
		form.addEventListener('submit', async function(e) {
			e.preventDefault();
			const nombre = document.getElementById('item-nombre').value.trim();
			const descripcion = document.getElementById('item-descripcion').value.trim();
			const cantidad = document.getElementById('item-cantidad').value;
			const precio = document.getElementById('item-precio').value;
			const cantidadMinima = document.getElementById('item-cantidad-minima').value;
			const categoria = document.getElementById('item-categoria').value;

			if (!Number.isInteger(Number(cantidad))) {
				alert('La cantidad debe ser un número entero.');
				return;
			}
			if (!Number.isInteger(Number(cantidadMinima))) {
				alert('La cantidad mínima debe ser un número entero.');
				return;
			}
			if (!nombre || !descripcion || !categoria) {
				alert('Por favor, complete todos los campos obligatorios.');
				return;
			}

			const data = {
				nombre,
				descripcion,
				id_categoria: categoria,
				precio_unitario: Number(precio),
				stock_actual: Number(cantidad),
				alarma: Number(cantidadMinima),
			};

			try {
				await crearItemAPI(data);
				alert('Item creado correctamente');
				// Refrescar la tabla si es necesario
				if (typeof obtenerInventario === 'function') obtenerInventario();
				// Cerrar el offcanvas
				const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasCreateItem'));
				if (offcanvas) offcanvas.hide();
				form.reset();
			} catch (err) {
				alert('Error al crear el item: ' + (err.message || err));
			}
		});
	}
});
