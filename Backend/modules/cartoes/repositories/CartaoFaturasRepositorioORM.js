import { Op } from "sequelize";
import { CartaoFaturaModel } from "../../../database/models/index.js";

export class CartaoFaturasRepositorioORM {
  async buscarFaturasDoMesPorUsuarioECartoes({ idUsuario, ano, mes, idsCartao }) {
    if (!idsCartao?.length) return [];

    return CartaoFaturaModel.findAll({
      where: {
        idUsuario,
        ano,
        mes,
        idCartao: { [Op.in]: idsCartao },
      },
    });
  }
}
