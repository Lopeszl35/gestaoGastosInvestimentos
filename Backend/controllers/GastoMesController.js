import { validationResult } from "express-validator";
import TransactionUtil from "../utils/TransactionUtil.js";

export default class GastoMesController {
    constructor(GastoMesModel, TransactionUtil) {
        this.GastoMesModel = GastoMesModel;
        this.TransactionUtil = TransactionUtil;
    }
    async configGastoLimiteMes(req, res) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }

        const { id_usuario } = req.query;
        const dataMes = req.body; // Objeto contendo o limite de gasto e o mês

        if(!id_usuario || !dataMes.limiteGastoMes || !dataMes.mes) {
            return res.status(400).json({ message: "Id de usuário ou limite de gasto ou mês não informado."});
        } 

        try {
            const result = await this.TransactionUtil.executeTransaction(async (connection) => {
                return await this.GastoMesModel.configGastoLimiteMes(id_usuario, dataMes, connection);
            })
            return res.status(200).json(result);
        } catch (error) {
            console.error('Erro ao configurar gasto do mês:', error.message);
            res.status(400).json({ message: "Erro ao configurar gasto do mês: " + error.message});
        }
    }
}