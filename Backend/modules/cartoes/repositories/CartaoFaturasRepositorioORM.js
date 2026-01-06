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

  /**
   * UPSERT de fatura mensal:
   * - Se a fatura (cartão + ano + mes) existir, soma em totalLancamentos
   * - Se não existir, cria com totalLancamentos = valorSomar
   *
   * Usamos transaction + lock para evitar race condition em cenários concorrentes
   * (ex: dois lançamentos criados ao mesmo tempo no mesmo mês).
   */
  async upsertSomarTotalLancamentos({
    idUsuario,
    idCartao,
    ano,
    mes,
    valorSomar,
    transaction,
  }) {
    const valor = Number(valorSomar);
    if (!Number.isFinite(valor) || valor <= 0) {
      throw new Error("valorSomar inválido para upsertSomarTotalLancamentos.");
    }

    // Lock pessimista: impede duas transações de atualizarem a mesma fatura ao mesmo tempo
    const existente = await CartaoFaturaModel.findOne({
      where: { idUsuario, idCartao, ano, mes },
      transaction,
      lock: transaction?.LOCK?.UPDATE,
    });

    if (existente) {
      // increment é mais seguro do que fazer "totalLancamentos + valor" manualmente
      await existente.increment("totalLancamentos", { by: valor, transaction });
      await existente.reload({ transaction });
      return existente;
    }

    return CartaoFaturaModel.create(
      {
        idUsuario,
        idCartao,
        ano,
        mes,
        totalLancamentos: valor,
        totalPago: 0,
        status: "aberta",
      },
      { transaction }
    );
  }

}
