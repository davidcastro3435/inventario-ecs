import express from 'express';
import inventarioRoutes from './src/routes/inventario.js';
import categoriaRoutes from './src/routes/categoria.js';
import usuarioRoutes from './src/routes/usuario.js';
import bitacoraRoutes from './src/routes/bitacora.js';
import { authMiddleware } from './src/middleware/authMiddleware.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Middleware to parse JSON bodies
// Habilitar CORS para todas las rutas

app.use(cors({
  origin: 'http://localhost:8000', 
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Proteger todas las rutas excepto POST /usuario/login
app.use(authMiddleware);

app.use('/inventario', inventarioRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/bitacora', bitacoraRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});