import express from "express";
import cors from "cors";
import {
  validateCreateCategoria,
  validateGetCategorias,
  validateDeleteCategoria
} from "./categoriasValidade.js";

const router = express.Router();
router.use(cors());

export default (categoriasController) => {
  router.post("/criarCategoria/:id_usuario", validateCreateCategoria, (req, res, next) => {
    categoriasController.createCategorias(req, res, next);
  });

  router.get("/getCategoriasAtivas/:id_usuario", validateGetCategorias, (req, res, next) => {
    categoriasController.getCategoriasAtivas(req, res, next);
  });

  router.get("/getCategoriasInativas/:id_usuario", (req, res, next) => {
    categoriasController.getCategoriasInativas(req, res, next);
  });

  router.delete("/deleteCategorias", validateDeleteCategoria, (req, res, next) => {
    categoriasController.deleteCategoria(req, res, next);
  });

  router.patch("/categorias/:id_categoria/reativar", (req, res, next) => {
    categoriasController.reativarCategoria(req, res, next);
  });

  router.patch("/updateCategoria", (req, res, next) => {
    categoriasController.updateCategoria(req, res, next);
  });

  return router;
};
