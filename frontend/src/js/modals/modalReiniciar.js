// modalReiniciar.js
// Modal para reiniciar la contraseña de un usuario (similar a modalEliminar)

export function initModalReiniciar() {
  let modal = document.getElementById("modal-reiniciar");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-reiniciar";
    modal.className = "modal-reiniciar-overlay";
    modal.innerHTML = `
      <div class="modal-reiniciar-content">
        <h2 class="modal-reiniciar-title"></h2>
        <p class="modal-reiniciar-desc">Se establecerá la contraseña por defecto para este usuario.</p>
        <div class="modal-reiniciar-actions d-flex justify-content-center gap-2">
          <button id="btn-descartar-reiniciar" class="btn btn-secondary">Descartar</button>
          <button id="btn-confirmar-reiniciar" class="btn btn-warning">Reiniciar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

export function mostrarModalReiniciar({
  id,
  nombre,
  defaultPassword = "paradas123",
  onDescartar,
  onReiniciar,
}) {
  const modal = document.getElementById("modal-reiniciar");
  if (!modal)
    throw new Error(
      "Modal de reiniciar no inicializado. Llama a initModalReiniciar() primero.",
    );

  // Título y descripción
  modal.querySelector(".modal-reiniciar-title").textContent =
    `Reiniciar contraseña de ${nombre}`;
  const descEl = modal.querySelector(".modal-reiniciar-desc");
  if (descEl) {
    descEl.textContent = `Se reemplazará la contraseña por: "${defaultPassword}". Esta acción puede ser sensible; asegúrate de tener permisos.`;
  }

  // Mostrar modal (usa display flex por compatibilidad con estilos existentes)
  modal.style.display = "flex";

  const btnDescartar = modal.querySelector("#btn-descartar-reiniciar");
  const btnConfirmar = modal.querySelector("#btn-confirmar-reiniciar");

  // Resetear eventos antes de asignar nuevos
  if (btnDescartar) {
    btnDescartar.onclick = () => {
      modal.style.display = "none";
      if (onDescartar) onDescartar();
    };
  }

  if (btnConfirmar) {
    btnConfirmar.onclick = () => {
      // Llamar al callback pasando id y la contraseña por defecto
      if (onReiniciar) onReiniciar(id, defaultPassword);
      modal.style.display = "none";
    };
  }
}
