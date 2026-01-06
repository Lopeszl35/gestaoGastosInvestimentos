import { CartaoCreditoModel } from "../../../database/models/index.js";

export class CartoesRepositorioORM {
  async listarCartoesAtivosPorUsuario(idUsuario) {
    return CartaoCreditoModel.findAll({
      where: { idUsuario, ativo: true },
      order: [["created_at", "DESC"]],
    });
  }

  async buscarCartaoPorUuidEUsuario(uuidCartao, idUsuario) {
    return CartaoCreditoModel.findOne({
      where: { uuid: uuidCartao, idUsuario, ativo: true },
    });
  }

  async criarCartaoParaUsuario({
    idUsuario,
    uuidCartao,
    nome,
    bandeira,
    ultimos4,
    corHex,
    limite,
    diaFechamento,
    diaVencimento,
  }) {
    const criado = await CartaoCreditoModel.create({
        idUsuario,
        uuidCartao,
        nome,
        bandeira,
        ultimos4,
        corHex,
        limite,
        diaFechamento,
        diaVencimento,
        ativo: true,
    });
    return criado;
  }

}

