// db.js
// This file handles the MySQL database connection using mysql2 and exports a promise-based pool.
// Update the connection details as needed for your environment.

import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config(); // Load environment variables from .env

// Create a connection pool for efficient query handling
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,    // Adjust the pool size as needed
  queueLimit: 0
});

// Export the pool using promise-based API for async/await support
export default pool.promise();
