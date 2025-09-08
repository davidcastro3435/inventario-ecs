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
			window.location.href = '../pages/inventory.html';
		});
	}
	if (bitacoraBtn) {
		bitacoraBtn.addEventListener('click', function() {
			window.location.href = '../pages/bitacora.html';
		});
	}
	if (configuracionesBtn) {
		configuracionesBtn.addEventListener('click', function() {
			// Página de configuraciones aún no existe
			// window.location.href = 'configuraciones.html';
			// TODO: Añadir página de configuraciones y habilitar redirección
			alert('La página de configuraciones aún no está disponible.');
		});
	}
}
