import ErroSqlHandler from "../../../utils/ErroSqlHandler.js";

export default class GastoMesModel {
    constructor(GastoMesRepository) {
        this.GastoMesRepository = GastoMesRepository;
    }

    async configGastoLimiteMes(id_usuario, dataMes, connection) {
        try {
            const result = await this.GastoMesRepository.configGastoLimiteMes(id_usuario, dataMes, connection);
            return result;
        } catch (error) {
            console.error("Erro no GastoMesModel.configGastoLimiteMes:", error.message);
            ErroSqlHandler.tratarErroSql(error, 'gasto_mes');
            throw error;
        }
    }

}