// modalEliminar.js
// Lógica del modal de confirmación para eliminar un item

// modalEliminar.js
export function initModalEliminar() {
  let modal = document.getElementById("modal-eliminar");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-eliminar";
    modal.className = "modal-eliminar-overlay";
    modal.innerHTML = `
            <div class="modal-eliminar-content">
                <h2 class="modal-eliminar-title"></h2>
                <p class="modal-eliminar-desc">Esta acción no puede deshacerse</p>
                <div class="modal-eliminar-actions d-flex justify-content-center gap-2">
                    <button id="btn-descartar-eliminar" class="btn btn-secondary">Descartar</button>
                    <button id="btn-confirmar-eliminar" class="btn btn-danger">Eliminar</button>
                </div>
            </div>
        `;
    document.body.appendChild(modal);
  }
}

export function mostrarModalEliminar({ id, nombre, onDescartar, onEliminar }) {
  const modal = document.getElementById("modal-eliminar");
  if (!modal)
    throw new Error(
      "Modal de eliminar no inicializado. Llama a initModalEliminar() primero.",
    );

  modal.querySelector(".modal-eliminar-title").textContent =
    `Eliminar ${nombre}`;
  modal.style.display = "flex";

  const btnDescartar = modal.querySelector("#btn-descartar-eliminar");
  const btnConfirmar = modal.querySelector("#btn-confirmar-eliminar");

  // Resetear eventos antes de asignar nuevos
  btnDescartar.onclick = () => {
    modal.style.display = "none";
    if (onDescartar) onDescartar();
  };

  btnConfirmar.onclick = () => {
    if (onEliminar) onEliminar(id);
    modal.style.display = "none";
  };
}
