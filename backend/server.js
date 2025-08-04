import express from 'express';
import inventarioRoutes from './src/routes/inventario.js';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Middleware to parse JSON bodies

app.use('/inventario', inventarioRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});