
export default class GastoMesModel {
  constructor(GastoMesRepository) {
    this.GastoMesRepository = GastoMesRepository;
  }

  async configGastoLimiteMes(id_usuario, dadosMes, connection) {
    try {
      return await this.GastoMesRepository.configGastoLimiteMes(
        id_usuario,
        dadosMes,
        connection
      );
    } catch (error) {
      console.error("Erro no GastoMesService.configGastoLimiteMes:",error.message);
      throw error;
    }
  }

  async getLimiteGastosMes(id_usuario, ano, mes) {
    try {
      return await this.GastoMesRepository.getLimiteGastosMes(id_usuario, ano, mes);
    } catch (error) {
      console.error("Erro ao obter limite de gastos no model: " + error.message);
      throw error;
    }
  }

  async getGastosTotaisPorCategoria({ idUsuario, inicio, fim }) {
    try {
      return this.GastoMesRepository.getGastosTotaisPorCategoria({
        idUsuario,
        inicio,
        fim,
      });
    } catch (error) {
      
    }
  }

  async addGasto(gastos, id_usuario, connection) {
        try {
            const saldoAtual = await this.GastoMesRepository.getSaldoAtual(id_usuario, connection);
            console.log("Saldo atual do usuário:", saldoAtual, "Valor do gasto:", gastos.valor);
            if (saldoAtual < gastos.valor) {
                return {
                    mensagem: "Saldo insuficiente para realizar o gasto.",
                    code: "SALDO_INSUFICIENTE",
                };
            }
            const result = await this.GastoMesRepository.addGasto(gastos, id_usuario, connection);
            return result;
        } catch (error) {
            console.log("Erro ao adicionar gasto no service:", error.message);
            throw error;
        }
    }
}
