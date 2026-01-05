export default class GastosFixosService {
  constructor(GastosFixosRepository) {
    this.GastosFixosRepository = GastosFixosRepository;
  }

  async getResumoGastosFixos(id_usuario) {
    try {
      return await this.GastosFixosRepository.obterResumoGastosFixos(id_usuario);
    } catch (error) {
      console.error("Erro no GastosFixosService.getResumoGastosFixos:", error.message);
      throw error;
    }
  }

  async addGastoFixo(gastoFixo, id_usuario) {
    try {
      // Regra mínima: normalizar strings
      const payload = {
        ...gastoFixo,
        titulo: String(gastoFixo.titulo).trim(),
        descricao: gastoFixo.descricao ? String(gastoFixo.descricao).trim() : null,
      };

      return await this.GastosFixosRepository.inserirGastoFixo(payload, id_usuario);
    } catch (error) {
      console.error("Erro no GastosFixosService.addGastoFixo:", error.message);
      throw error;
    }
  }

  async getGastosFixos(id_usuario, somente_ativos) {
    try {
      const somenteAtivos = String(somente_ativos ?? "0") === "1";

      return await this.GastosFixosRepository.listarGastosFixos(id_usuario, {
        somenteAtivos,
      });
    } catch (error) {
      console.error("Erro no GastosFixosService.getGastosFixos:", error.message);
      throw error;
    }
  }
}
