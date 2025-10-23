/*
inventario-ecs/frontend/src/js/toastHelper.js

Helper compartido para mostrar Bootstrap toasts en la esquina superior derecha.

Funciones exportadas (named):
 - initToastContainer(opts)   -> crea el contenedor de toasts (id configurable)
 - showToast(message, type, options) -> muestra un toast. Devuelve objeto { el, dispose() }
 - showSuccess(message, options)
 - showError(message, options)
 - showInfo(message, options)
 - clearToasts() -> elimina todos los toasts y contenedor (opcional)

Nota:
 - Este helper usa la API de Bootstrap 5 (window.bootstrap.Toast) si está disponible para animaciones/autohide.
 - Si Bootstrap no está disponible, hace un fallback simple que remueve el toast tras `delay`.
 - Los mensajes se insertan como texto (no HTML) para evitar inyección.
*/

const DEFAULT_CONTAINER_ID = "toast-container";
const DEFAULT_DELAY = 4000; // ms
const DEFAULT_Z_INDEX = 10800;

/**
 * Inicializa (si no existe) el contenedor para los toasts en la esquina superior derecha.
 * @param {{ id?: string, top?: string, right?: string, zIndex?: number }} opts
 * @returns {HTMLElement} contenedor
 */
export function initToastContainer(opts = {}) {
  const id = opts.id || DEFAULT_CONTAINER_ID;
  let container = document.getElementById(id);
  if (container) return container;

  container = document.createElement("div");
  container.id = id;
  // Posición top-right
  container.style.position = "fixed";
  container.style.top = opts.top || "1rem";
  container.style.right = opts.right || "1rem";
  container.style.zIndex = String(opts.zIndex || DEFAULT_Z_INDEX);
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "0.5rem";
  container.style.alignItems = "flex-end"; // que los toasts queden alineados a la derecha
  // Evitar que contenedor capture clicks accidentalmente
  container.style.pointerEvents = "none";

  document.body.appendChild(container);
  return container;
}

/**
 * Muestra un toast.
 * @param {string} message - texto del mensaje (se trata como texto plano)
 * @param {'primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark'} type
 * @param {{ delay?: number, autohide?: boolean, containerId?: string }} options
 * @returns {{ el: HTMLElement, dispose: function }} objeto con referencia al elemento y método para eliminarlo
 */
export function showToast(message, type = "primary", options = {}) {
  const delay = typeof options.delay === "number" ? options.delay : DEFAULT_DELAY;
  const autohide = options.autohide !== undefined ? Boolean(options.autohide) : true;
  const containerId = options.containerId || DEFAULT_CONTAINER_ID;

  const container = initToastContainer({ id: containerId, zIndex: options.zIndex });

  // Crear elemento del toast
  const toastEl = document.createElement("div");
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");
  // permitir clicks dentro del toast (para que el botón de cerrar funcione)
  toastEl.style.pointerEvents = "auto";
  toastEl.style.minWidth = "200px";
  toastEl.style.maxWidth = "360px";

  // Construir contenido del toast de manera segura (texto plano)
  const inner = document.createElement("div");
  inner.className = "d-flex";

  const body = document.createElement("div");
  body.className = "toast-body";
  body.style.whiteSpace = "pre-wrap";
  body.textContent = String(message || "");

  // Botón close (usa data-bs-dismiss para que Bootstrap lo reconozca si está presente)
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn-close btn-close-white me-2 m-auto";
  btn.setAttribute("aria-label", "Close");
  btn.setAttribute("data-bs-dismiss", "toast");

  inner.appendChild(body);
  inner.appendChild(btn);
  toastEl.appendChild(inner);

  // Añadir al contenedor
  container.appendChild(toastEl);

  let bootstrapToast = null;
  let fallbackTimeout = null;
  let disposed = false;

  // Función para limpiar y remover
  function dispose() {
    if (disposed) return;
    disposed = true;

    // Si existiera instancia de bootstrap la ocultamos y la eliminamos
    try {
      if (bootstrapToast && typeof bootstrapToast.dispose === "function") {
        bootstrapToast.dispose();
      }
    } catch (e) {
      // ignore
    }

    // Remover elemento del DOM
    try {
      toastEl.remove();
    } catch (e) {
      // ignore
    }

    // Limpiar fallback
    if (fallbackTimeout) {
      clearTimeout(fallbackTimeout);
      fallbackTimeout = null;
    }
  }

  // Si Bootstrap Toast disponible -> usarlo
  try {
    if (window && window.bootstrap && window.bootstrap.Toast) {
      bootstrapToast = new window.bootstrap.Toast(toastEl, { autohide, delay });
      // Cuando Bootstrap oculta el toast emitirá 'hidden.bs.toast' — removemos el elemento entonces
      toastEl.addEventListener("hidden.bs.toast", () => {
        try {
          toastEl.remove();
        } catch (e) {}
      });
      // Mostrar
      bootstrapToast.show();
      // Para permitir que el botón close funcione correctamente con Bootstrap, dejamos que el data-bs-dismiss actúe.
    } else {
      // Fallback simple: mostrar y auto eliminar después de delay si autohide true
      // Podríamos añadir alguna clase 'show' para apariencia básica, pero depende del CSS de Bootstrap en la página.
      toastEl.classList.add("show");
      if (autohide) {
        fallbackTimeout = setTimeout(() => {
          try {
            toastEl.remove();
          } catch (e) {}
        }, delay);
      }
      // Conectar el botón close al remover el toast
      btn.addEventListener("click", () => {
        try {
          toastEl.remove();
        } catch (e) {}
      });
    }
  } catch (err) {
    // En caso de error, asegurar limpieza posterior
    fallbackTimeout = setTimeout(() => {
      try {
        toastEl.remove();
      } catch (e) {}
    }, delay);
  }

  return { el: toastEl, dispose };
}

/**
 * Shortcuts
 */
export function showSuccess(message, options = {}) {
  return showToast(message, "success", options);
}
export function showError(message, options = {}) {
  return showToast(message, "danger", options);
}
export function showInfo(message, options = {}) {
  return showToast(message, "info", options);
}
export function showWarning(message, options = {}) {
  return showToast(message, "warning", options);
}

/**
 * Elimina todos los toasts y el contenedor (útil en tests o reset de UI)
 * @param {string} containerId
 */
export function clearToasts(containerId = DEFAULT_CONTAINER_ID) {
  const container = document.getElementById(containerId);
  if (!container) return;
  try {
    // Si hay instancias de bootstrap, intentar disponer cada toast
    const toasts = Array.from(container.querySelectorAll(".toast"));
    toasts.forEach((t) => {
      try {
        if (window && window.bootstrap && window.bootstrap.Toast) {
          const inst = window.bootstrap.Toast.getInstance(t);
          if (inst && typeof inst.dispose === "function") inst.dispose();
        }
      } catch (e) {}
      try {
        t.remove();
      } catch (e) {}
    });
  } catch (e) {
    // ignore
  }
  try {
    container.remove();
  } catch (e) {}
}

/**
 * Export default con las utilidades
 */
export default {
  initToastContainer,
  showToast,
  showSuccess,
  showError,
  showInfo,
  showWarning,
  clearToasts,
};
