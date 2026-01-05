import express from "express";
import cors from "cors";
import { validateGetResumoGastosFixos, validateAddGastoFixo, validateGetGastosFixos, validateToggleGastoFixoAtivo } from "./GastosFixosValidate.js";

const router = express.Router();
router.use(cors());

export default (gastosFixosController) => {
  // Resumo para a tela (cards)
  router.get(
    "/getResumoGastosFixos/:id_usuario",
    validateGetResumoGastosFixos,
    (req, res, next) => {
      gastosFixosController.getResumo(req, res, next);
    }
  );

  // Adicionar gasto fixo
  router.post(
    "/addGastoFixo",
    validateAddGastoFixo,
    (req, res, next) => gastosFixosController.addGastoFixo(req, res, next)
  );

  // Obter gastos fixos
  router.get(
    "/getGastosFixos/:id_usuario",
    validateGetGastosFixos,
    (req, res, next) => gastosFixosController.getGastosFixos(req, res, next)
  );

// rota para atualizar o status do gasto fixo
 router.patch(
    "/gastosFixos/:id_gasto_fixo/ativo",
    (req, res, next) => gastosFixosController.toggleAtivo(req, res, next)
  );

  // endpoint único para a tela
  router.get(
    "/getTelaGastosFixos/:id_usuario",
    validateGetResumoGastosFixos,
    (req, res, next) => gastosFixosController.getTela(req, res, next)
  );

  return router;
};
