// authGuard.js
// Helper para comprobar expiración de JWT en localStorage y reenviar al usuario a la pantalla de autenticación.
// Exporta utilidades para usar en las páginas y también un inicializador que puede adjuntar un interceptor de fetch.
//
// Notas:
// - Intenta decodificar el payload del JWT y usa la claim `exp` (segundos desde epoch).
// - Si exp no existe o token está mal formado se considera inválido y se redirige.
// - Al redirigir elimina `token` y `userId` del localStorage para evitar loops.

function parseJwt(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    // Base64Url -> Base64
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // atob puede tirar si base64 malformado
    const jsonPayload = decodeURIComponent(
      Array.prototype.map
        .call(atob(base64), function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("parseJwt error:", e);
    return null;
  }
}

function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload) return true; // si no se pudo decodificar, tratamos como expirado
  // exp usualmente es segundos desde epoch
  if (!payload.exp) return true; // si no tiene exp, consideramos inválido/expirado
  const nowSec = Date.now() / 1000;
  // Añadir pequeño margen de seguridad (p. ej. 10s) para evitar condiciones de carrera
  return nowSec > payload.exp - 10;
}

function clearAuthStorage() {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  } catch (e) {
    // Fallo al manipular localStorage; no hacemos nada más
    console.error("clearAuthStorage error:", e);
  }
}

function computeDefaultAuthPath() {
  // Preferimos rutas relativas simples que funcionen desde las páginas:
  // - Si la página actual está dentro de una carpeta "pages", ./auth.html resolverá correctamente.
  // - De lo contrario probamos ../pages/auth.html.
  // Usamos './auth.html' por defecto porque la mayoría de nuestras pages están en la misma carpeta.
  return "./auth.html";
}

function redirectToAuth(redirectTo) {
  const dest = redirectTo || computeDefaultAuthPath();
  // Limpiar credenciales antes de redirigir
  clearAuthStorage();
  try {
    // Cambiamos location.href (esto reemplaza la página actual en el historial)
    window.location.href = dest;
  } catch (e) {
    // Si por alguna razón falló cambiar href, intentamos asignación directa
    try {
      window.location.assign(dest);
    } catch (err) {
      console.error("No se pudo redirigir al login:", err);
    }
  }
}

/**
 * requireAuth
 * Comprueba token en localStorage y redirige al login si está ausente o expirado.
 */
export function requireAuth(redirectTo) {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    redirectToAuth(redirectTo);
    // Devolvemos false para que el invocador sepa que no está autenticado
    return false;
  }
  return true;
}

/**
 * initAuthGuard
 * Inicializa un guard que:
 *  - Verifica inmediatamente el token y redirige si está expirado.
 *  - Opcionalmente revisa periódicamente la expiración cada `checkIntervalSec` segundos.
 *  - Opcionalmente intercepta `fetch` y redirige si una respuesta devuelve 401 (no autorizado).
 */
export function initAuthGuard({
  redirectTo = undefined,
  checkIntervalSec = 30,
  interceptFetch = true,
} = {}) {
  // Check inicial
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    redirectToAuth(redirectTo);
    return { stop: () => {} };
  }

  let intervalId = null;
  if (checkIntervalSec && Number(checkIntervalSec) > 0) {
    intervalId = setInterval(
      () => {
        const t = localStorage.getItem("token");
        if (!t || isTokenExpired(t)) {
          redirectToAuth(redirectTo);
        }
      },
      Number(checkIntervalSec) * 1000,
    );
  }

  // Interceptor simple de fetch para manejar 401
  const originalFetch = window.fetch;
  let fetchWrapped = originalFetch;
  if (interceptFetch && typeof window.fetch === "function") {
    fetchWrapped = async function (...args) {
      try {
        const res = await originalFetch.apply(this, args);
        if (res && res.status === 401) {
          // Token inválido/expirado en el backend -> limpiar y redirigir
          redirectToAuth(redirectTo);
          // Rechazamos la promesa con un error para que el llamador pueda manejarlo
          const error = new Error("Unauthorized");
          error.response = res;
          throw error;
        }
        return res;
      } catch (err) {
        // Si el error es por redirección ya no hacemos nada adicional
        throw err;
      }
    };
    try {
      window.fetch = fetchWrapped;
    } catch (e) {
      console.warn("No se pudo reemplazar window.fetch:", e);
    }
  }

  return {
    stop() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      // Restaurar fetch si lo sobrescribimos
      try {
        if (window.fetch !== originalFetch) {
          window.fetch = originalFetch;
        }
      } catch (e) {
        // ignore
      }
    },
  };
}

// Exportar utilidades para pruebas o usos puntuales
export default {
  parseJwt,
  isTokenExpired,
  requireAuth,
  initAuthGuard,
  clearAuthStorage,
};
