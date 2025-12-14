import { validationResult } from "express-validator";
import validarEntradaGastoMes from "../errors/validarEntradaGastos.js";

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

        validarEntradaGastoMes({ id_usuario, dadosMes });

        const result = await this.TransactionUtil.executeTransaction(async (connection) => {
            return this.GastoMesModel.configGastoLimiteMes(id_usuario, dadosMes, connection);
        });

        res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
    async getGastoLimiteMes(req, res) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const { id_usuario } = req.query;
        if(!id_usuario) {
            return res.status(400).json({message: "Id do usuário não informado"});
        }
        try {
            const result = await this.GastoMesModel.getLimiteGastosMes(id_usuario);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Erro ao obter limite de gastos no mês do usuário ' + error.message)
            res.status(400).json({message: "Erro ao obter limites de gastos no mês do usuário " + error.message});
        }

    }

}