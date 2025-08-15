import { Router } from 'express';
import { obtenerTodasCategorias } from '../controllers/categoriaController.js';

const router = Router();

// GET /categoria/all
router.get('/all', obtenerTodasCategorias);

export default router;
