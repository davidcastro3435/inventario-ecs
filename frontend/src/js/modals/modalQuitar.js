// modalQuitar.js
// Lógica del modal centrado para remover stock

export function iniciarModalQuitar() {
    let modal = document.getElementById('modal-quitar');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-quitar';
        modal.className = 'modal-quitar-overlay';
        modal.innerHTML = `
            <div class="modal-quitar-content">
                <h2 class="modal-quitar-title">Remover stock</h2>
                <p class="modal-quitar-desc">Ingresa la cantidad que deseas remover</p>
                <input type="number" min="1" class="form-control modal-quitar-input" placeholder="Cantidad" style="margin-bottom: 1rem;">
                <div class="modal-quitar-actions d-flex justify-content-center gap-2">
                    <button id="btn-descartar-quitar" class="btn btn-secondary">Descartar</button>
                    <button id="btn-confirmar-quitar" class="btn btn-primary">Aceptar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

export function mostrarModalQuitar({ id, nombre, onDescartar, onAceptar }) {
    iniciarModalQuitar();
    const modal = document.getElementById('modal-quitar');
    modal.style.display = 'flex';
    // Quitar listeners previos y clonar el modal
    const nuevoModal = modal.cloneNode(true);
    modal.parentNode.replaceChild(nuevoModal, modal);
    // Asignar contenido fijo
    nuevoModal.querySelector('.modal-quitar-title').textContent = `Remover stock`;
    nuevoModal.querySelector('.modal-quitar-desc').textContent = `Ingresa la cantidad que deseas remover`;
    const inputCantidad = nuevoModal.querySelector('.modal-quitar-input');
    inputCantidad.value = '';
    // Listeners
    nuevoModal.querySelector('#btn-descartar-quitar').onclick = () => {
        nuevoModal.style.display = 'none';
        inputCantidad.value = '';
        inputCantidad.classList.remove('is-invalid');
        if (onDescartar) onDescartar();
    };
    nuevoModal.querySelector('#btn-confirmar-quitar').onclick = () => {
        const cantidad = Number(inputCantidad.value);
        if (!cantidad || cantidad < 1) {
            alert('Ingrese una cantidad válida');
            inputCantidad.classList.add('is-invalid');
            return;
        }
        inputCantidad.classList.remove('is-invalid');
        if (onAceptar) onAceptar(cantidad);
        nuevoModal.style.display = 'none';
    };
}