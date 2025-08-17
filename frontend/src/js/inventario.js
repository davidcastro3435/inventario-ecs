// inventario.js
// Obtiene los datos del inventario desde el API y los muestra en la tabla de inventory.html

import { obtenerInventarioAPI, obtenerCategoriasAPI, crearItemAPI } from '../services/inventarioService.js';

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

	// Guardar: validación y POST
	modalForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		// Validar campos
		const nombre = modalForm['nombre'].value.trim();
		const descripcion = modalForm['descripcion'].value.trim();
		const cantidad = modalForm['cantidad'].value.trim();
		const precio = modalForm['precio'].value.trim();
		const alerta = modalForm['alerta'].value.trim();
		const id_categoria = categoriaSelect.value;

		let errorMsg = '';
		if (!nombre || !descripcion || !cantidad || !precio || !alerta || !id_categoria) {
			errorMsg = 'Todos los campos son obligatorios.';
		} else if (!/^[0-9]+$/.test(cantidad)) {
			errorMsg = 'Cantidad debe ser un número entero.';
		} else if (!/^[0-9]+$/.test(alerta)) {
			errorMsg = 'Alerta debe ser un número entero.';
		} else if (isNaN(parseFloat(precio))) {
			errorMsg = 'Precio unitario debe ser un número.';
		} else if (!id_categoria) {
			errorMsg = 'Debe seleccionar una categoría.';
		}
		if (errorMsg) {
			alert(errorMsg);
			return;
		}

		// Construir objeto para el API
		const data = {
			nombre,
			descripcion,
			stock_actual: parseInt(cantidad, 10),
			precio_unitario: parseFloat(precio),
			alerta: parseInt(alerta, 10),
			id_categoria
		};
		try {
			await crearItemAPI(data);
			modalOverlay.style.display = 'none';
			modalForm.reset();
			obtenerInventario(); // refrescar tabla
			alert('Item creado exitosamente.');
		} catch (err) {
			alert('Error al crear el item.');
		}
	});
});

