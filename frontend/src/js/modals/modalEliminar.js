// modalEliminar.js
// Lógica del modal de confirmación para eliminar un item

export function mostrarModalEliminar(id, eliminarItemAPI, onSuccess) {
    let modal = document.getElementById('modal-eliminar');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-eliminar';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <h2>¿Eliminar item?</h2>
                <p>¿Estás seguro de que deseas eliminar este item?</p>
                <div class="modal-actions">
                    <button id="btn-cancelar-eliminar" class="btn">Cancelar</button>
                    <button id="btn-confirmar-eliminar" class="btn btn-danger">Eliminar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        modal.style.display = 'flex';
    }
    // Quitar listeners previos
    const nuevoModal = modal.cloneNode(true);
    modal.parentNode.replaceChild(nuevoModal, modal);
    // Listeners
    nuevoModal.querySelector('#btn-cancelar-eliminar').onclick = () => {
        nuevoModal.style.display = 'none';
    };
    nuevoModal.querySelector('#btn-confirmar-eliminar').onclick = async () => {
        try {
            await eliminarItemAPI(id);
            nuevoModal.style.display = 'none';
            if (onSuccess) onSuccess();
        } catch (err) {
            alert('Error al eliminar el item');
        }
    };
}
