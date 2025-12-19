import express from "express";
import cors from "cors";

const router = express.Router();

router.use(cors());

export default (gastoMesController) => {
  // Rota para obter o limite de gasto do mês do usuário
  router.get("/getLimiteGastoMes", (req, res) => {
    gastoMesController.getGastoLimiteMes(req, res);
  });

  // Rota para obter todos os gastos com data por categoira de todo o período
  router.get("/relatorioGastos", (req, res, next) => {
    gastoMesController.getGastosTotaisPorCategoria(req, res, next);
  });

  // Rota para configurar o limite de gasto do mês do usuário
  router.post("/configGastoLimiteMes/:id_usuario", (req, res, next) => {
    gastoMesController.configGastoLimiteMes(req, res, next);
  });

  return router;
};
