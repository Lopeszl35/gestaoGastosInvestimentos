export default class GastosFixosController {
  constructor(GastosFixosService) {
    this.GastosFixosService = GastosFixosService;
  }

  async getResumo(req, res, next) {
    try {
      const { id_usuario } = req.params;

      const resumo = await this.GastosFixosService.getResumoGastosFixos(Number(id_usuario));

      return res.status(200).json(resumo);
    } catch (error) {
      next(error);
    }
  }

   async addGastoFixo(req, res, next) {
    try {
      const id_usuario = Number(req.query.id_usuario);
      const gastoFixo = req.body.gastoFixo;

      const result = await this.GastosFixosService.addGastoFixo(gastoFixo, id_usuario);

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getGastosFixos(req, res, next) {
    try {
      const { id_usuario } = req.params;
      const { somente_ativos } = req.query;

      const lista = await this.GastosFixosService.getGastosFixos(
        Number(id_usuario),
        somente_ativos
      );

      return res.status(200).json(lista);
    } catch (error) {
      next(error);
    }
  }

  async toggleAtivo(req, res, next) {
    try {
      const id_gasto_fixo = Number(req.params.id_gasto_fixo);
      const id_usuario = Number(req.query.id_usuario);
      const ativo = Number(req.body.ativo);

      const result = await this.GastosFixosService.toggleAtivoGastoFixo(
        id_gasto_fixo,
        id_usuario,
        ativo
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getTela(req, res, next) {
    try {
      const { id_usuario } = req.params;

      const tela = await this.GastosFixosService.getTelaGastosFixos(Number(id_usuario));

      return res.status(200).json(tela);
    } catch (error) {
      next(error);
    }
  }
}
