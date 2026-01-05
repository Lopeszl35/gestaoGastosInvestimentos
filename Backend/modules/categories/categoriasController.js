
class CategoriasController {
  constructor(CategoriasService, TransactionUtil) {
    this.CategoriasService = CategoriasService;
    this.TransactionUtil = TransactionUtil;
  }

  async createCategorias(req, res, next) {
    try {
      const { id_usuario } = req.params;
      const categoria = req.body.categoria;
      console.log("Categoria recebida: ", categoria);
      const result = await this.TransactionUtil.executeTransaction(
        async (connection) => {
          return await this.CategoriasService.createCategoria(
            categoria,
            id_usuario,
            connection
          );
        }
      );
      if (result.code === "FALHA_CRIACAO_CATEGORIA") {
        return res.status(400).json({
          message: result.mensagem,
          code: result.code,
        });
      }
      res.status(201).json(result);
    } catch (error) {
      console.error("Erro ao criar categoria:", error.message);
      next(error);
    }
  }

  async updateCategoria(req, res, next) {
    const { id_categoria } = req.query;
    const categoria = req.body;
    if (!id_categoria) {
      return res
        .status(400)
        .json({ message: "Id da categoria não informado." });
    }

    try {
      const result = await this.TransactionUtil.executeTransaction(
        async (connection) => {
          return await this.CategoriasService.updateCategoria(
            id_categoria,
            categoria,
            connection
          );
        }
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategoria(req, res, next) {
    const { id_categoria } = req.query;
    const dataAtual = new Date();
    try {
      await this.TransactionUtil.executeTransaction(
        async (connection) => {
          return await this.CategoriasService.deleteCategoria(
            id_categoria,
            dataAtual,
            connection
          );
        }
      );
      res.status(200).json({
        message: "Categoria deletada com sucesso",
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoriasAtivas(req, res, next) {
    const { id_usuario } = req.params;

    try {
      const result = await this.CategoriasService.getCategoriasAtivas(id_usuario);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCategoriasInativas(req, res, next) {
    const { id_usuario } = req.params;
    try {
      const result = await this.CategoriasService.getCategoriasInativas(id_usuario);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async reativarCategoria(req, res, next) {
    const { id_categoria } = req.params;
    const { id_usuario } = req.query;

    try {
      const result = await this.TransactionUtil.executeTransaction(
        async (connection) => {
          return await this.CategoriasService.reativarCategoria(
            id_categoria,
            id_usuario,
            connection
          );
        }
      )
      console.log('result: ', result);
      res.status(200).json({
        message: "Categoria reativada com sucesso",
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }

  
}

export default CategoriasController;
