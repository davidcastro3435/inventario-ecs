// inventario.js
// Obtiene los datos del inventario desde el API y los muestra en la tabla de inventory.html

// Función para obtener los items del API
async function obtenerInventario() {
	try {
		const response = await fetch('http://localhost:3000/inventario/items');
		if (!response.ok) throw new Error('Error al obtener inventario');
		const items = await response.json();
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

// Delegación de eventos para los botones de acción
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
});

