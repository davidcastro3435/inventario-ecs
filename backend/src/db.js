// Este archivo configura la conexión a la base de datos MySQL utilizando mysql2 y dotenv para manejar las variables de entorno.

import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config(); // Cargar variables de entorno desde .env

// Crear un pool de conexiones para un manejo eficiente de las consultas
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Número máximo de conexiones en el pool
  queueLimit: 0
});

// Exportar el pool utilizando una API basada en promesas para soporte de async/await
export default pool.promise();
