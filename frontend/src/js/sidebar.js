// Script para navegación del sidebar reutilizable
export function setupSidebarNavigation() {
	const dashboardBtn = document.getElementById('sidebar-dashboard');
	const inventarioBtn = document.getElementById('sidebar-inventario');
	const bitacoraBtn = document.getElementById('sidebar-bitacora');
	const configuracionesBtn = document.getElementById('sidebar-configuraciones');

	if (dashboardBtn) {
		dashboardBtn.addEventListener('click', function() {
			window.location.href = '../pages/dashboard.html';
		});
	}
	if (inventarioBtn) {
		inventarioBtn.addEventListener('click', function() {
            const token = localStorage.getItem('token');
            const tokenDecodificado = decodificarJWT(token);

			if (tokenDecodificado) {
                // Comprobar el rol
                if (tokenDecodificado.rol === 'admin') {
                    window.location.href = '../pages/inventory.html';
                } else {
                    window.location.href = '../pages/inventarioBasico.html';
                }
			} else {
				console.error('Token no encontrado en localStorage');
			}
		});
	}
	if (bitacoraBtn) {
		bitacoraBtn.addEventListener('click', function() {
			window.location.href = '../pages/bitacora.html';
		});
	}
	if (configuracionesBtn) {
		configuracionesBtn.addEventListener('click', function() {
			window.location.href = 'configuracion.html';
		});
	}
}

function decodificarJWT(token) {
    try {
        if (!token || token.split('.').length !== 3) {
            throw new Error("Token JWT inválido");
        }

        // Separar el token en sus partes (header, payload, signature)
        const base64Url = token.split('.')[1];
        
        // Convertir de Base64Url a Base64
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // Decodificar la parte Base64
        const decodedPayload = atob(base64);
        
        // Convertir el payload de texto JSON a un objeto
        const jsonPayload = JSON.parse(decodedPayload);
        
        return jsonPayload;  // Devuelve el objeto con los datos del payload
    } catch (error) {
        console.error('Error al decodificar el JWT:', error);
        return null;  // En caso de error, retorna null
    }
}