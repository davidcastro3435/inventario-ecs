// Este archivo configura la conexión a la base de datos MySQL utilizando mysql2 y dotenv para manejar las variables de entorno.

import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

// Especifica el path absoluto o relativo a tu archivo .env
dotenv.config(); // Ajusta el path según la ubicación real
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// Crear un pool de conexiones para PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  ssl: process.env.DB_SSLMODE === 'require' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: process.env.DB_CONNECT_TIMEOUT ? parseInt(process.env.DB_CONNECT_TIMEOUT) * 1000 : 10000
});

export default pool;
