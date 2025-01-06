

export default class GastoMesRepository {
    constructor(database) {
        this.database = database;
    }

    async configGastoLimiteMes(id_usuario, dataMes, connection) {
        const sql = `
            INSERT INTO Total_Gastos_Mes (id_usuarios, mes, total_limite,)
            VALUES (?, ?, ?)
        `;
        const params = [id_usuario, dataMes.mes, dataMes.limiteGastoMes];
        try {
            const result = await connection.query(sql, params);
            return result;
        } catch (error) {
            console.error("Erro no GastoMesRepository.configGastoLimiteMes:", error.message);
            throw error;
        }
    }

}