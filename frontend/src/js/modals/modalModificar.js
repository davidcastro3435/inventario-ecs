// modalModificar.js
import { mostrarModalItemForm } from './modalItemForm.js';

export function mostrarModalModificar({
    item,
    patchItemAPI,
    refrescarTabla,
    obtenerCategoriasAPI
}) {
    mostrarModalItemForm({
        titulo: 'Modificar Item',
        valoresIniciales: item,
        onSubmit: (data) => patchItemAPI(item.id_producto, data),
        refrescarTabla,
        obtenerCategoriasAPI
    });
}
