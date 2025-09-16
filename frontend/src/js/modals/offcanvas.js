// offcanvas.js


import { obtenerInventarioAPI, obtenerCategoriasAPI, crearItemAPI, patchItemAPI } from '../../services/inventarioService.js';
document.addEventListener('DOMContentLoaded', () => {
    // --- Offcanvas Crear Item ---
    const btnCreate = document.getElementById('btn-create');
    const formCreate = document.getElementById('form-create-item');

    if (btnCreate) {
        btnCreate.addEventListener('click', () => {
            const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasCreateItem'));
            offcanvas.show();

            // Llenar categorías cada vez que se abre
            const categoriaSelect = document.getElementById('item-categoria');
            if (categoriaSelect) {
                obtenerCategoriasAPI()
                    .then(data => {
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
                    .catch(() => {
                        categoriaSelect.innerHTML = '<option value="" disabled selected>No se pudieron cargar categorías</option>';
                    });
            }
        });
    }

    if (formCreate) {
        formCreate.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('item-nombre').value.trim();
            const descripcion = document.getElementById('item-descripcion').value.trim();
            const cantidad = document.getElementById('item-cantidad').value;
            const precio = document.getElementById('item-precio').value;
            const cantidadMinima = document.getElementById('item-cantidad-minima').value;
            const categoria = document.getElementById('item-categoria').value;

            if (!Number.isInteger(Number(cantidad)) || !Number.isInteger(Number(cantidadMinima))) {
                alert('La cantidad y la cantidad mínima deben ser enteros.');
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
                if (typeof obtenerInventario === 'function') obtenerInventario();

                const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasCreateItem'));
                if (offcanvas) offcanvas.hide();
                formCreate.reset();
            } catch (err) {
                alert('Error al crear el item: ' + (err.message || err));
            }
        });
    }

    // --- Offcanvas Editar Item ---
    const tbody = document.querySelector('.inventory-table tbody');
    const formEdit = document.getElementById('form-edit-item');

    if (tbody) {
        tbody.addEventListener('click', async (e) => {
            const btn = e.target.closest('.btn-modificar');
            if (!btn) return;

            const id = btn.getAttribute('data-id');

            try {
                const items = await obtenerInventarioAPI();
                const item = items.find(i => String(i.id_producto) === String(id));

                if (!item) {
                    alert('No se encontró el item.');
                    return;
                }

                const offcanvasEdit = new bootstrap.Offcanvas(document.getElementById('offcanvasEditItem'));
                offcanvasEdit.show();

                document.getElementById('edit-nombre').value = item.nombre || '';
                document.getElementById('edit-descripcion').value = item.descripcion || '';
                document.getElementById('edit-cantidad').value = item.stock_actual || '';
                document.getElementById('edit-precio').value = item.precio_unitario || '';
                document.getElementById('edit-cantidad-minima').value = item.cantidad_minima || '';

                // Cargar categorías
                const categoriaSelect = document.getElementById('edit-categoria');
                if (categoriaSelect) {
                    const categorias = await obtenerCategoriasAPI();
                    categoriaSelect.innerHTML = '<option value="" disabled>Seleccione una categoría</option>';
                    if (Array.isArray(categorias)) {
                        categorias.forEach(cat => {
                            const option = document.createElement('option');
                            option.value = cat.id_categoria || cat._id || cat.id || cat.nombre;
                            option.textContent = cat.nombre;
                            if (String(option.value) === String(item.id_categoria)) {
                                option.selected = true;
                            }
                            categoriaSelect.appendChild(option);
                        });
                    }
                }

                formEdit.dataset.itemId = id;
            } catch (err) {
                alert('Error al cargar el item: ' + (err.message || err));
            }
        });
    }

    if (formEdit) {
        formEdit.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = formEdit.dataset.itemId;

            const data = {
                nombre: document.getElementById('edit-nombre').value.trim(),
                descripcion: document.getElementById('edit-descripcion').value.trim(),
                id_categoria: document.getElementById('edit-categoria').value,
                precio_unitario: Number(document.getElementById('edit-precio').value),
                stock_actual: Number(document.getElementById('edit-cantidad').value),
                alarma: Number(document.getElementById('edit-cantidad-minima').value)
            };

            try {
                await patchItemAPI(id, data);
                alert('Item modificado correctamente');
                if (typeof obtenerInventario === 'function') obtenerInventario();

                const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasEditItem'));
                if (offcanvas) offcanvas.hide();
                formEdit.reset();
            } catch (err) {
                alert('Error al modificar el item: ' + (err.message || err));
            }
        });
    }
    // Offcanvas Crear Categoría

    // Abrir offcanvas al presionar el botón btn-nueva-categoria
    const btnNuevaCategoria = document.getElementById('btn-nueva-categoria');
    const offcanvasCategoria = document.getElementById('offcanvasCategoria');
    if (btnNuevaCategoria && offcanvasCategoria) {
        btnNuevaCategoria.addEventListener('click', function() {
            const offcanvas = new bootstrap.Offcanvas(offcanvasCategoria);
            offcanvas.show();
        });
    }

    // Lógica para enviar datos al API al crear categoría
    const formCategoria = document.getElementById('formCategoria');
    if (formCategoria) {
        formCategoria.addEventListener('submit', async function(e) {
            e.preventDefault();
            const nombre = document.getElementById('categoriaNombre').value.trim();
            const descripcion = document.getElementById('categoriaDescripcion').value.trim();
            if (!nombre || !descripcion) {
                alert('Completa todos los campos.');
                return;
            }
            try {
                await crearCategoriaAPI({ nombre, descripcion });
                alert('Categoría creada correctamente');
                formCategoria.reset();
                const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasCategoria);
                if (offcanvas) offcanvas.hide();
            } catch (err) {
                alert('Error al crear la categoría');
            }
        });
    }

});
