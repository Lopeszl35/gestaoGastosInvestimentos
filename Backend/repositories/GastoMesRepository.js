

export default class GastoMesRepository {
    constructor(database) {
        this.database = database;
    }

    async configGastoLimiteMes(id_usuario, dataMes, connection) {
        const sql = `
            INSERT INTO Total_Gastos_Mes (id_usuarios, mes, total_limite)
            VALUES (?, ?, ?)
        `;
        const params = [id_usuario, dataMes.mesAtual, dataMes.limiteGastoMes];
        try {
            const result = await connection.query(sql, params);
            return result;
        } catch (error) {
            console.error("Erro no GastoMesRepository.configGastoLimiteMes:", error.message);
            throw error;
        }
    }

    async getLimiteGastosMes(id_usuario) {
        const sql = `
            SELECT total_limite FROM Total_Gastos_Mes
            WHERE id_usuarios = ?
        `
        try {
            const result = await this.database.executaComandoNonQuery(sql, id_usuario)
            console.log("Resultado vindo do banco de dados: " + result)
            return result;
        } catch (error) {
            console.error("Erro no GastoMesRepository ao obter limite gasto mês: " + error.message);
            throw error;
        }
    }

}