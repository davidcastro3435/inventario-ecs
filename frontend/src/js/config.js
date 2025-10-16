// Configuración de la aplicacion
// Esa clase se encarga de manejar la configuración del usuario como cambio de contraseña, correo y creación de usuarios (solo admin)

import { patchContrasenaUsuario, patchCorreoUsuario } from '../services/usuarioService.js';

// Evento para cambiar contraseña
document.addEventListener('DOMContentLoaded', () => {
	const inputNuevaContrasena = document.getElementById('inputNuevaContrasena');
	const btnCambiarContrasena = document.getElementById('btnCambiarContrasena');

	if (btnCambiarContrasena && inputNuevaContrasena) {
		btnCambiarContrasena.addEventListener('click', async () => {
			const nuevaContrasena = inputNuevaContrasena.value.trim();
			if (!nuevaContrasena || nuevaContrasena.length < 6) {
				alert('La contraseña debe tener al menos 6 caracteres.');
				return;
			}

			try {
				await patchContrasenaUsuario({ nuevaContrasena });
				alert('Contraseña actualizada correctamente.');
				inputNuevaContrasena.value = '';
			} catch (err) {
				alert('Error al actualizar la contraseña.');
			}
		});
	}
});


// Evento para cambiar correo
document.addEventListener('DOMContentLoaded', () => {
	const inputNuevoCorreo = document.getElementById('inputNuevoCorreo');
	const btnCambiarCorreo = document.getElementById('btnCambiarCorreo');

	if (btnCambiarCorreo && inputNuevoCorreo) {
		btnCambiarCorreo.addEventListener('click', async () => {
			const nuevoCorreo = inputNuevoCorreo.value.trim();
			// Validación básica de correo
			const correoRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
			if (!nuevoCorreo || !correoRegex.test(nuevoCorreo)) {
				alert('Introduce un correo electrónico válido.');
				return;
			}

			try {
				await patchCorreoUsuario({ nuevoCorreo });
				alert('Correo actualizado correctamente.');
				inputNuevoCorreo.value = '';
			} catch (err) {
				alert('Error al actualizar el correo.');
			}
		});
	}
});