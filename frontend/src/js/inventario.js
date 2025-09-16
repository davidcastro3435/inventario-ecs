// inventario.js
// Obtiene los datos del inventario desde el API y los muestra en la tabla de inventory.html

import { obtenerInventarioAPI, obtenerCategoriasAPI, crearItemAPI, eliminarItemAPI, patchItemAPI } from '../services/inventarioService.js';
import { initModalEliminar, mostrarModalEliminar } from "./modals/modalEliminar.js";
import {iniciarModalAgregar, mostrarModalAgregar } from './modals/modalAgregar.js';
import { iniciarModalQuitar, mostrarModalQuitar } from './modals/modalQuitar.js';

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

// Mostrar offcanvas al hacer click en btn-create
document.addEventListener('DOMContentLoaded', function() {
	obtenerInventario();

	 // Inicializar el modal de eliminar (se crea en el DOM si no existe)
    initModalEliminar();
	iniciarModalAgregar();
	iniciarModalQuitar();

    const tbody = document.querySelector('.inventory-table tbody');
    if (tbody) {
        tbody.addEventListener('click', async (e) => {
            const btnEliminar = e.target.closest('.btn-eliminar');
            if (!btnEliminar) return;

            const id = btnEliminar.getAttribute('data-id');
            try {
                const items = await obtenerInventarioAPI();
                const item = items.find(i => String(i.id_producto) === String(id));
                if (!item) {
                    alert('No se encontró el item.');
                    return;
                }

                mostrarModalEliminar({
                    id,
                    nombre: item.nombre,
                    onDescartar: () => console.log("Cancelado"),
                    onEliminar: async (itemId) => {
                        await eliminarItemAPI(itemId);
                        obtenerInventario();
                        alert(`Item ${item.nombre} eliminado correctamente`);
                    }
                });
            } catch (err) {
                alert('Error al cargar el item: ' + (err.message || err));
            }
        });
    }

	// Evento para mostrar el modal agregar stock
	const tbodyAgregar = document.querySelector('.inventory-table tbody');
	if (tbodyAgregar) {
		tbodyAgregar.addEventListener('click', async function(e) {
			const btnAdd = e.target.closest('.btn-add');
			if (btnAdd) {
				const id = btnAdd.getAttribute('data-id');
				try {
					const items = await obtenerInventarioAPI();
					const item = items.find(i => String(i.id_producto) === String(id));
					if (!item) {
						alert('No se encontró el item.');
						return;
					}
					mostrarModalAgregar({
						id,
						nombre: item.nombre,
						onDescartar: () => {},
						onAceptar: async (itemId, cantidad) => {
							// Aquí puedes llamar a la función de inventarioService para agregar stock
							// Ejemplo:
							// await agregarStockAPI(itemId, cantidad);
							// obtenerInventario();
						}
					});
				} catch (err) {
					alert('Error al cargar el item: ' + (err.message || err));
				}
			}
		});
	}
	// Evento para mostrar el modal quitar stock
    const tbodyQuitar = document.querySelector('.inventory-table tbody');
    if (tbodyQuitar) {
        tbodyQuitar.addEventListener('click', async function(e) {
            const btnSubtract = e.target.closest('.btn-subtract');
            if (btnSubtract) {
                const id = btnSubtract.getAttribute('data-id');
                try {
                    const items = await obtenerInventarioAPI();
                    const item = items.find(i => String(i.id_producto) === String(id));
                    if (!item) {
                        alert('No se encontró el item.');
                        return;
                    }
                    mostrarModalQuitar({
                        id,
                        nombre: item.nombre,
                        onDescartar: () => {},
                        onAceptar: async (itemId, cantidad) => {
                            // Lógica para remover stock usando patchItemAPI
                            const jwt = localStorage.getItem('jwt');
                            try {
                                await patchItemAPI(itemId, { stock_actual: item.stock_actual - cantidad }, jwt);
                                obtenerInventario();
                                alert(`Stock removido correctamente`);
                            } catch (err) {
                                alert('Error al remover stock: ' + (err.message || err));
                            }
                        }
                    });
                } catch (err) {
                    alert('Error al cargar el item: ' + (err.message || err));
                }
            }
        });
    }
});
