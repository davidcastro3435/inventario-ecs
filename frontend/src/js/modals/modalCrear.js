// modalCrear.js
// Lógica del modal para crear un nuevo item

export function inicializarModalCrear({
    btnCreate,
    modalOverlay,
    modalForm,
    btnDiscard,
    categoriaSelect,
    obtenerCategoriasAPI,
    crearItemAPI,
    refrescarTabla
}) {
    btnCreate.addEventListener('click', async () => {
        modalOverlay.style.display = 'flex';
        await cargarCategoriasEnSelect(categoriaSelect, obtenerCategoriasAPI);
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
        } if (isNaN(parseInt(cantidad, 10)) || parseInt(cantidad, 10) < 0) {
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
        try {
            await crearItemAPI(data);
            modalOverlay.style.display = 'none';
            modalForm.reset();
            if (refrescarTabla) refrescarTabla();
            alert('Item creado exitosamente.');
        } catch (err) {
            alert('Error al crear el item.');
        }
    });
}

function cargarCategoriasEnSelect(selectElement, obtenerCategoriasAPI) {
    selectElement.innerHTML = '<option value="">Cargando...</option>';
    return obtenerCategoriasAPI().then(categorias => {
        selectElement.innerHTML = '<option value="">Seleccione una categoría</option>';
        categorias.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id_categoria || cat.id || cat.nombre; // fallback
            opt.textContent = cat.nombre;
            selectElement.appendChild(opt);
        });
    }).catch(() => {
        selectElement.innerHTML = '<option value="">Error al cargar</option>';
    });
}
