import ErroSqlHandler from "../../../errors/ErroSqlHandler.js";

export default class GastoMesModel {
    constructor(GastoMesRepository) {
        this.GastoMesRepository = GastoMesRepository;
    }

    async configGastoLimiteMes(id_usuario, dadosMes, connection) {
        try {
            return await this.GastoMesRepository.configGastoLimiteMes(id_usuario, dadosMes, connection);
        } catch (error) {
            console.error("Erro no GastoMesModel.configGastoLimiteMes:", error.message);
            ErroSqlHandler.tratarErroSql(error);
            throw error;
        }
    }

    async getLimiteGastosMes(id_usuario) {
        try {
            return await this.GastoMesRepository.getLimiteGastosMes(id_usuario);
        } catch (error) {
            console.error("Erro ao obter limite de gastos no model: " + error.message)
            ErroSqlHandler(error, 'gasto_mes');
        }
    }

}