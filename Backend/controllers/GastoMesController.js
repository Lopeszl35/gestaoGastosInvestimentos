import { validationResult } from "express-validator";
import ValidaEntradas from "../utils/ValidaEntradas.js";

export default class GastoMesController {
  constructor(GastoMesModel, TransactionUtil) {
    this.GastoMesModel = GastoMesModel;
    this.TransactionUtil = TransactionUtil;
  }
  async configGastoLimiteMes(req, res, next) {
    try {
      const { id_usuario } = req.params;
      const { dadosMes } = req.body;
      console.log("Dados recebidos na controller:", { id_usuario, dadosMes });

      ValidaEntradas.validarEntradaLimiteGastoMes({ id_usuario, dadosMes });

      const result = await this.TransactionUtil.executeTransaction(
        async (connection) => {
          return this.GastoMesModel.configGastoLimiteMes(
            id_usuario,
            dadosMes,
            connection
          );
        }
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  async getGastoLimiteMes(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id_usuario } = req.query;
    if (!id_usuario) {
      return res.status(400).json({ message: "Id do usuário não informado" });
    }
    try {
      const result = await this.GastoMesModel.getLimiteGastosMes(id_usuario);
      return res.status(200).json(result);
    } catch (error) {
      console.error(
        "Erro ao obter limite de gastos no mês do usuário " + error.message
      );
      res.status(400).json({
        message:
          "Erro ao obter limites de gastos no mês do usuário " + error.message,
      });
    }
  }

  async getGastosTotaisPorCategoria(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id_usuario, inicio, fim } = req.query;

      if (!id_usuario) {
        return res.status(400).json({ message: "Id do usuário não informado" });
      }

      // regra: ou manda as duas datas, ou nenhuma
      if ((inicio && !fim) || (!inicio && fim)) {
        return res.status(400).json({
          message: "Período incompleto",
          erros: ["Envie inicio e fim juntos, ou não envie nenhum."],
          status: 400,
        });
      }

      ValidaEntradas.validaDatas({ inicio, fim });
      

      const result = await this.GastoMesModel.getGastosTotaisPorCategoria(
        Number(id_usuario),
        inicio || null,
        fim || null
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
