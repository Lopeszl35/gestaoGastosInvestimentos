import { sequelize } from "../../database/sequelize.js";
import { CartaoCreditoEntity } from "./domain/CartaoCreditoEntity.js";
import naoEncontrado from "../../errors/naoEncontrado.js";
import crypto from "crypto";

function numero(valor) {
  if (valor === null || valor === undefined) return 0;
  const n = Number(valor);
  return Number.isFinite(n) ? n : Number.parseFloat(valor) || 0;
}

function criarDataISOPrimeiroDia(ano, mes) {
  const mm = String(mes).padStart(2, "0");
  return `${ano}-${mm}-01`;
}

function criarDataISOUltimoDia(ano, mes) {
  const data = new Date(Date.UTC(ano, mes, 0)); // dia 0 do próximo mês = último do mês atual
  const yyyy = data.getUTCFullYear();
  const mm = String(data.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(data.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function diferencaMeses(dataInicio, ano, mes) {
  const inicio = new Date(`${dataInicio}T00:00:00.000Z`);
  const anoInicio = inicio.getUTCFullYear();
  const mesInicio = inicio.getUTCMonth() + 1;

  return (ano - anoInicio) * 12 + (mes - mesInicio);
}

export class CartoesService {
  constructor({ cartoesRepositorio, faturasRepositorio, lancamentosRepositorio }) {
    this.cartoesRepositorio = cartoesRepositorio;
    this.faturasRepositorio = faturasRepositorio;
    this.lancamentosRepositorio = lancamentosRepositorio;
  }

  async obterVisaoGeralCartoes({ idUsuario, ano, mes, uuidCartaoSelecionado }) {
    const cartoesModel = await this.cartoesRepositorio.listarCartoesAtivosPorUsuario(idUsuario);

    if (!cartoesModel.length) {
      return {
        periodo: { ano, mes },
        cartoes: [],
        cartaoSelecionadoUuid: null,
        detalhes: null,
      };
    }

    const idsCartao = cartoesModel.map((c) => c.idCartao);

    const faturasDoMes = await this.faturasRepositorio.buscarFaturasDoMesPorUsuarioECartoes({
      idUsuario,
      ano,
      mes,
      idsCartao,
    });

    const faturaPorIdCartao = new Map();
    for (const f of faturasDoMes) {
      faturaPorIdCartao.set(f.idCartao, f);
    }

    const cartoes = cartoesModel.map((c) => {
      const entidade = new CartaoCreditoEntity({
        uuid: c.uuid,
        nome: c.nome,
        bandeira: c.bandeira,
        ultimos4: c.ultimos4,
        corHex: c.corHex,
        limite: c.limite,
        diaFechamento: c.diaFechamento,
        diaVencimento: c.diaVencimento,
      });

      const fatura = faturaPorIdCartao.get(c.idCartao);
      const limiteUsado = fatura ? numero(fatura.totalLancamentos) - numero(fatura.totalPago) : 0;

      return {
        uuid: entidade.uuid,
        nome: entidade.nome,
        bandeira: entidade.bandeira,
        ultimos4: entidade.ultimos4,
        corHex: entidade.corHex,
        diaFechamento: entidade.diaFechamento,
        diaVencimento: entidade.diaVencimento,
        limiteTotal: numero(entidade.limite),
        limiteUsado: Number(limiteUsado.toFixed(2)),
        limiteDisponivel: entidade.calcularLimiteDisponivel(limiteUsado),
        percentualUsado: entidade.calcularPercentualUsado(limiteUsado),
      };
    });

    // cartão selecionado (ou o primeiro)
    const uuidSelecionado = uuidCartaoSelecionado ?? cartoes[0].uuid;

    const cartaoSelecionadoModel = await this.cartoesRepositorio.buscarCartaoPorUuidEUsuario(uuidSelecionado, idUsuario);
    if (!cartaoSelecionadoModel) {
      throw new naoEncontrado("Cartão não encontrado para este usuário.");
    }

    const entidadeSelecionada = new CartaoCreditoEntity({
      uuid: cartaoSelecionadoModel.uuid,
      nome: cartaoSelecionadoModel.nome,
      bandeira: cartaoSelecionadoModel.bandeira,
      ultimos4: cartaoSelecionadoModel.ultimos4,
      corHex: cartaoSelecionadoModel.corHex,
      limite: cartaoSelecionadoModel.limite,
      diaFechamento: cartaoSelecionadoModel.diaFechamento,
      diaVencimento: cartaoSelecionadoModel.diaVencimento,
    });

    const faturaSelecionada = faturaPorIdCartao.get(cartaoSelecionadoModel.idCartao);
    const limiteUsadoSelecionado = faturaSelecionada
      ? numero(faturaSelecionada.totalLancamentos) - numero(faturaSelecionada.totalPago)
      : 0;

    const primeiroDiaMes = criarDataISOPrimeiroDia(ano, mes);
    const ultimoDiaMes = criarDataISOUltimoDia(ano, mes);

    
    const lancamentosQueAfetamOMes = await this.lancamentosRepositorio.listarLancamentosQueGeramCobrancaNoMes({
      idUsuario,
      idCartao: cartaoSelecionadoModel.idCartao,
      dataPrimeiroDiaMes: primeiroDiaMes,
      dataUltimoDiaMes: ultimoDiaMes,
      sequelize,
    });

    const itensDoMes = [];
    const porCategoriaMap = new Map();
    const parcelasAtivas = [];

    for (const l of lancamentosQueAfetamOMes) {
      const mesesDesdeInicio = diferencaMeses(l.primeiroMesRef, ano, mes);
      const numeroParcelaNoMes = mesesDesdeInicio + 1;

      if (numeroParcelaNoMes < 1 || numeroParcelaNoMes > l.numeroParcelas) continue;

      const valorParcela = numero(l.valorParcela);
      const categoria = l.categoria?.trim() || "Outros";

      itensDoMes.push({
        idLancamento: l.idLancamento,
        descricao: l.descricao,
        categoria,
        dataCompra: l.dataCompra,
        valor: Number(valorParcela.toFixed(2)),
        parcela: {
          atual: numeroParcelaNoMes,
          total: l.numeroParcelas,
        },
      });

      porCategoriaMap.set(categoria, numero((porCategoriaMap.get(categoria) ?? 0) + valorParcela));

      const aindaEstaAtivo = l.numeroParcelas > 1 && l.parcelasPagas < l.numeroParcelas;
      const parcelaAtualAindaNaoPaga = numeroParcelaNoMes > l.parcelasPagas;

      if (aindaEstaAtivo && parcelaAtualAindaNaoPaga) {
        parcelasAtivas.push({
          idLancamento: l.idLancamento,
          descricao: l.descricao,
          valorParcela: Number(valorParcela.toFixed(2)),
          parcelaAtual: numeroParcelaNoMes,
          totalParcelas: l.numeroParcelas,
          parcelasPagas: l.parcelasPagas,
          restam: l.numeroParcelas - l.parcelasPagas,
        });
      }
    }

    const porCategoria = Array.from(porCategoriaMap.entries())
      .map(([categoria, valor]) => ({ categoria, valor: Number(valor.toFixed(2)) }))
      .sort((a, b) => b.valor - a.valor);

    const totalGastosMes = itensDoMes.reduce((acc, item) => acc + numero(item.valor), 0);

    return {
      periodo: { ano, mes },
      cartoes,
      cartaoSelecionadoUuid: entidadeSelecionada.uuid,
      detalhes: {
        resumoCartao: {
          uuid: entidadeSelecionada.uuid,
          nome: entidadeSelecionada.nome,
          bandeira: entidadeSelecionada.bandeira,
          ultimos4: entidadeSelecionada.ultimos4,
          corHex: entidadeSelecionada.corHex,
          limiteTotal: numero(entidadeSelecionada.limite),
          limiteUsado: Number(limiteUsadoSelecionado.toFixed(2)),
          limiteDisponivel: entidadeSelecionada.calcularLimiteDisponivel(limiteUsadoSelecionado),
          diaFechamento: entidadeSelecionada.diaFechamento,
          diaVencimento: entidadeSelecionada.diaVencimento,
        },
        porCategoria,
        parcelasAtivas,
        gastosDoMes: {
          total: Number(totalGastosMes.toFixed(2)),
          itens: itensDoMes,
        },
      },
    };
  }

  async criarCartaoCredito({ idUsuario, dadosCartao }) {
    

    const uuidCartao = crypto.randomUUID();

    const entidade = new CartaoCreditoEntity({
      uuid: uuidCartao,
      nome: dadosCartao.nome,
      bandeira: dadosCartao.bandeira ?? null,
      ultimos4: dadosCartao.ultimos4 ?? null,
      corHex: dadosCartao.corHex ?? null,
      limite: dadosCartao.limite,
      diaFechamento: dadosCartao.diaFechamento,
      diaVencimento: dadosCartao.diaVencimento,
      ativo: true,
    });

    const criadoModel = await this.cartoesRepositorio.criarCartaoParaUsuario({
      idUsuario,
      uuidCartao: entidade.uuid,
      nome: entidade.nome,
      bandeira: entidade.bandeira,
      ultimos4: entidade.ultimos4,
      corHex: entidade.corHex,
      limite: entidade.limite,
      diaFechamento: entidade.diaFechamento,
      diaVencimento: entidade.diaVencimento,
    });

    // Garantia mínima
    if (!criadoModel) {
      throw new naoEncontrado("Não foi possível criar o cartão.");
    }

    return {
      uuid: criadoModel.uuidCartao,
      nome: criadoModel.nome,
      bandeira: criadoModel.bandeira,
      ultimos4: criadoModel.ultimos4,
      corHex: criadoModel.corHex,
      limiteTotal: numero(criadoModel.limite),
      diaFechamento: criadoModel.diaFechamento,
      diaVencimento: criadoModel.diaVencimento,
      ativo: Boolean(criadoModel.ativo),
    };
  } 

}
