// modalAgregar.js
// Modal centrado para agregar stock a un item
export function iniciarModalAgregar() {
	let modal = document.getElementById('modal-agregar');
	if (!modal) {
		modal = document.createElement('div');
		modal.id = 'modal-agregar';
		modal.className = 'modal-agregar-overlay';
		modal.innerHTML = `
			<div class="modal-agregar-content">
				<h2 class="modal-agregar-title">Agregar stock</h2>
				<p class="modal-agregar-desc">Selecciona la cantidad que deseas agregar</p>
				<input type="number" class="form-control modal-agregar-input" id="modal-agregar-cantidad" min="1" placeholder="Cantidad" required style="margin-bottom:1.5rem;">
				<div class="modal-agregar-actions d-flex justify-content-center gap-2">
					<button id="btn-descartar-agregar" class="btn btn-secondary">Descartar</button>
					<button id="btn-aceptar-agregar" class="btn btn-primary">Aceptar</button>
				</div>
			</div>
		`;
		document.body.appendChild(modal);
	}
}

export function mostrarModalAgregar({ id, nombre, onDescartar, onAceptar }) {
	iniciarModalAgregar();
	const modal = document.getElementById('modal-agregar');
	modal.style.display = 'flex';
	// Quitar listeners previos
	const nuevoModal = modal.cloneNode(true);
	modal.parentNode.replaceChild(nuevoModal, modal);
	// Listeners
	nuevoModal.querySelector('#btn-descartar-agregar').onclick = () => {
		nuevoModal.style.display = 'none';
		if (onDescartar) onDescartar();
	};
	nuevoModal.querySelector('#btn-aceptar-agregar').onclick = () => {
		const cantidad = Number(nuevoModal.querySelector('#modal-agregar-cantidad').value);
		if (!cantidad || cantidad < 1) {
			alert('Ingrese una cantidad válida');
			return;
		}
		if (onAceptar) onAceptar(id, cantidad);
		nuevoModal.style.display = 'none';
	};
}