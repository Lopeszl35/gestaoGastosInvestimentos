import NaoEncontrado from "../../errors/naoEncontrado.js";

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

   async toggleAtivoGastoFixo(id_gasto_fixo, id_usuario, ativo) {
    try {
      const gasto = await this.GastosFixosRepository.buscarGastoFixoPorIdEUsuario(
        id_gasto_fixo,
        id_usuario
      );

      if (!gasto) {
        throw new NaoEncontrado("Gasto fixo não encontrado para este usuário.");
      }

      await this.GastosFixosRepository.atualizarAtivoGastoFixo(
        id_gasto_fixo,
        id_usuario,
        ativo
      );

      return { mensagem: "Status atualizado com sucesso." };
    } catch (error) {
      console.error("Erro no GastosFixosService.toggleAtivoGastoFixo:", error.message);
      throw error;
    }
  }

   async getTelaGastosFixos(id_usuario) {
    try {
      // roda em paralelo pra performance
      const [resumo, gastosPorCategoria, lista] = await Promise.all([
        this.GastosFixosRepository.obterResumoGastosFixos(id_usuario),
        this.GastosFixosRepository.obterGastosFixosPorCategoria(id_usuario),
        this.GastosFixosRepository.listarGastosFixos(id_usuario, { somenteAtivos: false }),
      ]);

      return {
        resumo,
        gastosPorCategoria,
        lista,
      };
    } catch (error) {
      console.error("Erro no GastosFixosService.getTelaGastosFixos:", error.message);
      throw error;
    }
  }
}
