import { Op } from "sequelize";
import { CartaoLancamentoModel } from "../../../database/models/index.js";

export class CartaoLancamentosRepositorioORM {
  async listarLancamentosAtivosDoCartaoDoUsuario(idUsuario, idCartao) {
    return CartaoLancamentoModel.findAll({
      where: { idUsuario, idCartao, ativo: true },
      order: [["data_compra", "DESC"]],
    });
  }

  async listarLancamentosQueGeramCobrancaNoMes({ idUsuario, idCartao, dataPrimeiroDiaMes, dataUltimoDiaMes, sequelize }) {
    // Filtra no banco só os lançamentos que “podem” afetar o mês (intervalo)
    return CartaoLancamentoModel.findAll({
      where: {
        idUsuario,
        idCartao,
        ativo: true,
        [Op.and]: [
          // primeiro_mes_ref <= ultimo_dia_do_mes
          sequelize.literal(`primeiro_mes_ref <= '${dataUltimoDiaMes}'`),
          // DATE_ADD(primeiro_mes_ref, INTERVAL (numero_parcelas-1) MONTH) >= primeiro_dia_do_mes
          sequelize.literal(
            `DATE_ADD(primeiro_mes_ref, INTERVAL (numero_parcelas - 1) MONTH) >= '${dataPrimeiroDiaMes}'`
          ),
        ],
      },
      order: [["data_compra", "DESC"]],
    });
  }

   /**
   * Cria um lançamento (à vista ou parcelado) na tabela cartao_lancamentos.
   * OBS: Aqui não é lugar de regra de negócio — isso já veio calculado da Entity (valorParcela, primeiroMesRef, etc).
   */
  async criarLancamentoCartao({
    idUsuario,
    idCartao,
    descricao,
    categoria,
    valorTotal,
    numeroParcelas,
    valorParcela,
    dataCompra,
    primeiroMesRef,
    transaction,
  }) {
    return CartaoLancamentoModel.create(
      {
        idUsuario,
        idCartao,
        descricao,
        categoria: categoria ?? null,
        valorTotal,
        numeroParcelas,
        valorParcela,
        dataCompra,
        primeiroMesRef,
        parcelasPagas: 0,
        ativo: true,
      },
      { transaction }
    );
  }

}
