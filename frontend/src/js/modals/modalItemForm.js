// modalItemForm.js
// Lógica base y reutilizable para el modal de crear/modificar item


export function mostrarModalItemForm({
    titulo,
    valoresIniciales = {},
    onSubmit,
    refrescarTabla,
    obtenerCategoriasAPI
}) {
    let modalOverlay = document.getElementById('modal-itemform-overlay');
    let modalForm;
    let btnDiscard;
    let categoriaSelect;

    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'modal-itemform-overlay';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal">
                <h2>${titulo}</h2>
                <form id="modal-itemform-form" class="modal-form">
                    <label>Nombre</label>
                    <input name="nombre" type="text" required />
                    <label>Descripción</label>
                    <input name="descripcion" type="text" required />
                    <label>Cantidad</label>
                    <input name="cantidad" type="number" min="0" required />
                    <label>Precio unitario</label>
                    <input name="precio" type="number" min="0" step="0.01" required />
                    <label>Alerta</label>
                    <input name="alerta" type="number" min="0" required />
                    <label>Categoría</label>
                    <select id="modal-itemform-categoria" required></select>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-discard">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modalOverlay);
    } else {
        modalOverlay.style.display = 'flex';
    }
    modalOverlay.style.display = 'flex';
    modalForm = document.getElementById('modal-itemform-form');
    btnDiscard = modalOverlay.querySelector('.btn-discard');
    categoriaSelect = document.getElementById('modal-itemform-categoria');

    // Cargar categorías y setear valores actuales
    cargarCategoriasEnSelect(categoriaSelect, valoresIniciales.id_categoria, obtenerCategoriasAPI).then(() => {
        modalForm['nombre'].value = valoresIniciales.nombre || '';
        modalForm['descripcion'].value = valoresIniciales.descripcion || '';
        modalForm['cantidad'].value = valoresIniciales.stock_actual || '';
        modalForm['precio'].value = valoresIniciales.precio_unitario || '';
        modalForm['alerta'].value = valoresIniciales.alerta || '';
        categoriaSelect.value = valoresIniciales.id_categoria || '';
    });

    // Cerrar modal
    btnDiscard.onclick = () => {
        modalOverlay.style.display = 'none';
        modalForm.reset();
    };
    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.style.display = 'none';
            modalForm.reset();
        }
    };

    // Guardar cambios/crear
    modalForm.onsubmit = async (e) => {
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
        } else if (isNaN(parseInt(cantidad, 10)) || parseInt(cantidad, 10) < 0) {
            errorMsg = 'Cantidad debe ser un número entero no negativo.';
        } else if (isNaN(parseInt(alerta, 10)) || parseInt(alerta, 10) < 0) {
            errorMsg = 'Alerta debe ser un número entero no negativo.';
        } else if (isNaN(parseFloat(precio)) || parseFloat(precio) < 0) {
            errorMsg = 'Precio unitario debe ser un número no negativo.';
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
        // Si es modificar, verificar si hubo cambios
        if (valoresIniciales && valoresIniciales.id_producto !== undefined) {
            const sinCambios =
                nombre === valoresIniciales.nombre &&
                descripcion === valoresIniciales.descripcion &&
                parseInt(cantidad, 10) === valoresIniciales.stock_actual &&
                parseFloat(precio) === valoresIniciales.precio_unitario &&
                parseInt(alerta, 10) === valoresIniciales.alerta &&
                id_categoria == valoresIniciales.id_categoria;
            if (sinCambios) {
                alert('No se realizó ningún cambio.');
                return;
            }
        }
        try {
            await onSubmit(data);
            modalOverlay.style.display = 'none';
            modalForm.reset();
            if (refrescarTabla) refrescarTabla();
            alert(valoresIniciales && valoresIniciales.id_producto !== undefined ? 'Item modificado exitosamente.' : 'Item creado exitosamente.');
        } catch (err) {
            alert('Error al guardar el item.');
        }
    };
// ...existing code...

function cargarCategoriasEnSelect(selectElement, selectedId, obtenerCategoriasAPI) {
    selectElement.innerHTML = '<option value="">Cargando...</option>';
    return (obtenerCategoriasAPI ? obtenerCategoriasAPI() : fetch('http://localhost:3000/categoria/all', {
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
        }
    }).then(r => r.json()))
    .then(categorias => {
        selectElement.innerHTML = '<option value="">Seleccione una categoría</option>';
        categorias.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id_categoria || cat.id || cat.nombre;
            opt.textContent = cat.nombre;
            if (opt.value == selectedId) opt.selected = true;
            selectElement.appendChild(opt);
        });
    })
    .catch(() => {
        selectElement.innerHTML = '<option value="">Error al cargar</option>';
    });
}
}
