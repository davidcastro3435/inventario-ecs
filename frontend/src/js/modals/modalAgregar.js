// modalCrear.js
import { mostrarModalItemForm } from './modalItemForm.js';

export function inicializarModalCrear({
    btnCreate,
    obtenerCategoriasAPI,
    crearItemAPI,
    refrescarTabla
}) {
    btnCreate.addEventListener('click', () => {
        mostrarModalItemForm({
            titulo: 'Crear Item',
            valoresIniciales: {},
            onSubmit: crearItemAPI,
            refrescarTabla,
            obtenerCategoriasAPI
        });
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
