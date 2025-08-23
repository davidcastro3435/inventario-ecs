// auth.js - Lógica de autenticación para Login

document.querySelector('.auth-form').addEventListener('submit', async function(e) {
	e.preventDefault();
	const usuario = document.getElementById('usuario').value.trim();
	const password = document.getElementById('password').value;

	if (!usuario || !password) {
		alert('Por favor, ingresa usuario y contraseña.');
		return;
	}

	try {
		const response = await fetch('http://localhost:3000/usuario/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ nombre: usuario, contrasena: password })
		});

		const data = await response.json();
		if (response.ok && data.token) {
			localStorage.setItem('token', data.token);
			localStorage.setItem('userId', data.id);
			window.location.href = 'inventory.html';
		} else {
			alert(data.mensaje || 'Credenciales incorrectas');
		}
	} catch (err) {
		alert('Error de conexión con el servidor');
	}
});
