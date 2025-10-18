import { Router } from "express";
import {
  obtenerTodasCategorias,
  crearCategoria,
} from "../controllers/categoriaController.js";

const router = Router();

// GET /categoria/all
router.get("/all", obtenerTodasCategorias);

// POST /categoria
router.post("/", crearCategoria);

export default router;
