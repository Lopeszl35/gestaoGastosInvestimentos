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
}
