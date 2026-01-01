import express from "express";
import cors from "cors";
import {
  validateCreateCategoria,
  validateGetCategorias
} from "./categoriasValidade.js";

const router = express.Router();
router.use(cors());

export default (categoriasController) => {
  router.post("/criarCategoria/:id_usuario", (req, res, next) => {
    categoriasController.createCategorias(req, res, next);
  });

  router.get("/getCategorias/:id_usuario", validateGetCategorias, (req, res, next) => {
    categoriasController.getCategorias(req, res, next);
  });

  router.delete("/deleteCategorias", (req, res, next) => {
    categoriasController.deleteCategoria(req, res, next);
  });

  router.patch("/updateCategoria", (req, res, next) => {
    categoriasController.updateCategoria(req, res, next);
  });

  return router;
};
