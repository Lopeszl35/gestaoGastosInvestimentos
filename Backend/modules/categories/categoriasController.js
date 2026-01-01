
class CategoriasController {
  constructor(CategoriasModel, TransactionUtil) {
    this.CategoriasModel = CategoriasModel;
    this.TransactionUtil = TransactionUtil;
  }

  async createCategorias(req, res, next) {
    try {
      const { idUsuario } = req.params;
      const categoria = req.body.categoria;
      const result = await this.TransactionUtil.executeTransaction(
        async (connection) => {
          return await this.CategoriasModel.createCategoria(
            categoria,
            idUsuario,
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

  async updateCategoria(req, res) {
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
          return await this.CategoriasModel.updateCategoria(
            id_categoria,
            categoria,
            connection
          );
        }
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error.message);
      res
        .status(400)
        .json({ message: "Erro ao atualizar categoria: " + error.message });
    }
  }

  async deleteCategoria(req, res) {
    const { id_categoria } = req.query;
    if (!id_categoria) {
      return res
        .status(400)
        .json({ message: "Id da categoria não informado." });
    }
    try {
      const result = await this.TransactionUtil.executeTransaction(
        async (connection) => {
          return await this.CategoriasModel.deleteCategoria(
            id_categoria,
            connection
          );
        }
      );
      console.log("result: ", result);
      res.status(200).json(result);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Erro ao deletar categoria: " + error.message });
    }
  }

  async getCategorias(req, res, next) {
    const { id_usuario } = req.params;
    console.log("id_usuario recebido: ", id_usuario);
    try {
      const result = await this.CategoriasModel.getCategorias(id_usuario);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  
}

export default CategoriasController;
