/**
 * Regras de negócio de alertas financeiros.
 * - Decide QUANDO criar alerta e qual mensagem/severidade.
 */

const TIPO_ALERTA_CATEGORIA_PROXIMO = "LIMITE_CATEGORIA_PROXIMO";
const TIPO_ALERTA_CATEGORIA_ULTRAPASSADO = "LIMITE_CATEGORIA_ULTRAPASSADO";

// Ajuste aqui se quiser (ex.: 90)
const PERCENTUAL_PARA_ALERTA_PROXIMO = 80;

export default class AlertasService {
  constructor(AlertasRepository, NotificacoesService) {
    this.AlertasRepository = AlertasRepository;
    this.NotificacoesService = NotificacoesService;
  }

  _extrairAnoMes(data_gasto) {
    // data_gasto esperado: 'YYYY-MM-DD'
    const partes = String(data_gasto).split("-");
    const ano = Number(partes?.[0]);
    const mes = Number(partes?.[1]);
    return { ano, mes };
  }

  async verificarECriarAlertasCategoriaAoInserirGasto({
    id_usuario,
    id_categoria,
    data_gasto,
    id_gasto_referencia,
    connection,
  }) {
    const categoria = await this.AlertasRepository.buscarCategoriaPorId({
      id_usuario,
      id_categoria,
      connection,
    });

    if (!categoria) return { criado: false, motivo: "CATEGORIA_NAO_ENCONTRADA" };
    if (Number(categoria.ativo) !== 1) return { criado: false, motivo: "CATEGORIA_INATIVA" };

    const limiteCategoria = Number(categoria.limite ?? 0);
    if (!limiteCategoria || limiteCategoria <= 0) {
      return { criado: false, motivo: "CATEGORIA_SEM_LIMITE" };
    }

    const totalGastoCategoriaMes = await this.AlertasRepository.buscarTotalGastoCategoriaNoMes({
      id_usuario,
      id_categoria,
      data_gasto,
      connection,
    });

    const percentual = (totalGastoCategoriaMes / limiteCategoria) * 100;

    const { ano, mes } = this._extrairAnoMes(data_gasto);

    // 1) Próximo do limite
    if (percentual >= PERCENTUAL_PARA_ALERTA_PROXIMO && percentual < 100) {
      await this.#criarAlertaSeNaoExistir({
        id_usuario,
        id_categoria,
        ano,
        mes,
        tipo_alerta: TIPO_ALERTA_CATEGORIA_PROXIMO,
        severidade: "ATENCAO",
        mensagem: `Você atingiu ${percentual.toFixed(2)}% do limite da categoria "${categoria.nome}". (Limite: ${Number(limiteCategoria).toFixed(2)} | Total no mês: ${Number(totalGastoCategoriaMes).toFixed(2)})`,
        dados_json: {
          id_categoria: Number(id_categoria),
          nome_categoria: categoria.nome,
          ano,
          mes,
          limite_categoria: Number(limiteCategoria),
          total_gasto_categoria_mes: Number(totalGastoCategoriaMes),
          percentual: Number(percentual.toFixed(2)),
          id_gasto_referencia: id_gasto_referencia ?? null,
        },
        connection,
      });
    }

    // 2) Ultrapassou o limite
    if (percentual >= 100) {
      await this.#criarAlertaSeNaoExistir({
        id_usuario,
        id_categoria,
        ano,
        mes,
        tipo_alerta: TIPO_ALERTA_CATEGORIA_ULTRAPASSADO,
        severidade: "CRITICO",
        mensagem: `Você ultrapassou o limite da categoria "${categoria.nome}" (${percentual.toFixed(2)}%). (Limite: ${Number(limiteCategoria).toFixed(2)} | Total no mês: ${Number(totalGastoCategoriaMes).toFixed(2)})`,
        dados_json: {
          id_categoria: Number(id_categoria),
          nome_categoria: categoria.nome,
          ano,
          mes,
          limite_categoria: Number(limiteCategoria),
          total_gasto_categoria_mes: Number(totalGastoCategoriaMes),
          percentual: Number(percentual.toFixed(2)),
          id_gasto_referencia: id_gasto_referencia ?? null,
        },
        connection,
      });
    }

    return { criado: true, percentual: Number(percentual.toFixed(2)) };
  }

  async #criarAlertaSeNaoExistir({
    id_usuario,
    id_categoria,
    ano,
    mes,
    tipo_alerta,
    severidade,
    mensagem,
    dados_json,
    connection,
  }) {
    const jaExiste = await this.AlertasRepository.existeAlertaCategoriaNoMes({
      id_usuario,
      id_categoria,
      ano,
      mes,
      tipo_alerta,
      connection,
    });

    if (jaExiste) return { criado: false, motivo: "ALERTA_JA_EXISTE" };

    const created = await this.AlertasRepository.criarAlerta({
      id_usuario,
      severidade,
      tipo_alerta,
      mensagem,
      dados_json,
      connection,
    });

    await this.NotificacoesService.enviarMensagemParaUsuario({
      id_usuario,
      titulo: "Alerta financeiro",
      mensagem,
      dados_extras: dados_json,
    });

    return { criado: true, ...created };
  }
}
