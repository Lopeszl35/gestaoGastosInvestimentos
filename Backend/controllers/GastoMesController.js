import { validationResult } from "express-validator";

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
        console.log("Request body: ", req.body);
        console.log(`Limite de gasto: ${req.body.dataMes.limiteGastoMes}, Mês: ${req.body.dataMes.mesAtual}`);
        const { dataMes } = req.body; // Objeto contendo o limite de gasto e o mês

        if(!id_usuario || !dataMes.limiteGastoMes || !dataMes.mesAtual) {
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