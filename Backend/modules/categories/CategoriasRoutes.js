import express from "express";
import cors from "cors";

const router = express.Router();
router.use(cors());

export default (categoriasController) => {
  router.post("/createCategorias", (req, res) => {
    categoriasController.createCategorias(req, res);
  });

  router.get("/getCategorias", (req, res, next) => {
    categoriasController.getCategorias(req, res, next);
  });

  router.delete("/deleteCategorias", (req, res) => {
    categoriasController.deleteCategoria(req, res);
  });

  router.patch("/updateCategoria", (req, res) => {
    categoriasController.updateCategoria(req, res);
  });

  return router;
};
