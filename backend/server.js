import express from 'express';
import inventarioRoutes from './src/routes/inventario.js';
import categoriaRoutes from './src/routes/categoria.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Middleware to parse JSON bodies
// Habilitar CORS para todas las rutas
app.use(cors());

app.use('/inventario', inventarioRoutes);
app.use('/categoria', categoriaRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});