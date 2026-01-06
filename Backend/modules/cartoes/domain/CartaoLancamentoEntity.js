// Backend/modules/cartoes/domain/CartaoLancamentoEntity.js
import ValidationError from "../../../errors/ValidationError.js";

/**
 * Entidade de domínio para Lançamentos de Cartão.
 *
 * Objetivo:
 * - Centralizar regras de negócio e validações (SRP / SOLID)
 * - Garantir consistência antes de chegar no banco (GRASP: Information Expert)
 * - Evitar lógica no Controller/Repository
 */
export class CartaoLancamentoEntity {
  constructor({
    descricao,
    categoria = null,
    valorTotal,
    dataCompra, // aceita "YYYY-MM-DD" ou "DD/MM/YYYY" (front às vezes manda assim)
    parcelado,
    numeroParcelas,
    diaFechamento, // do cartão (1..28)
  }) {
    this.descricao = this.#normalizarTexto(descricao);
    this.categoria = categoria ? this.#normalizarTexto(categoria) : null;

    this.valorTotal = this.#normalizarValorMonetario(valorTotal);
    this.parcelado = this.#normalizarBoolean(parcelado);
    this.numeroParcelas = this.#normalizarNumeroParcelas(this.parcelado, numeroParcelas);

    this.dataCompra = this.#normalizarData(dataCompra);
    this.diaFechamento = this.#normalizarDiaFechamento(diaFechamento);

    // Regra: se não é parcelado, sempre vira 1 parcela
    // (garante que o back não dependa do front)
    if (!this.parcelado) {
      this.numeroParcelas = 1;
    }

    // Calcula valor por parcela
    this.valorParcela = this.#calcularValorParcela(this.valorTotal, this.numeroParcelas);

    // Calcula mês de referência (primeira fatura afetada)
    this.primeiroMesRef = this.#calcularPrimeiroMesRef(this.dataCompra, this.diaFechamento);

    // Meses que serão impactados nas faturas (1 mês por parcela)
    this.mesesImpactados = this.#gerarMesesImpactados(this.primeiroMesRef, this.numeroParcelas);

    // Validações finais (garante objeto consistente e pronto pro service persistir)
    this.#validar();
  }

  /**
   * Valida consistência geral do objeto.
   * Mantém a entidade "sempre válida" após construção.
   */
  #validar() {
    if (!this.descricao || this.descricao.length < 2 || this.descricao.length > 255) {
      throw new ValidationError("Descrição inválida (2..255).");
    }

    if (this.categoria && this.categoria.length > 80) {
      throw new ValidationError("Categoria inválida (máximo 80).");
    }

    if (!(this.valorTotal > 0)) {
      throw new ValidationError("Valor total deve ser maior que 0.");
    }

    if (!Number.isInteger(this.numeroParcelas) || this.numeroParcelas < 1 || this.numeroParcelas > 60) {
      throw new ValidationError("Número de parcelas inválido (1..60).");
    }

    // dataCompra sempre normalizada para YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(this.dataCompra)) {
      throw new ValidationError("Data da compra inválida (use YYYY-MM-DD).");
    }

    if (!/^\d{4}-\d{2}-01$/.test(this.primeiroMesRef)) {
      throw new ValidationError("primeiroMesRef inválido (deve ser YYYY-MM-01).");
    }

    if (!Array.isArray(this.mesesImpactados) || this.mesesImpactados.length !== this.numeroParcelas) {
      throw new ValidationError("mesesImpactados inválido (deve ter o mesmo tamanho de numeroParcelas).");
    }
  }

  // =========================
  // Normalizadores / Helpers
  // =========================

  #normalizarTexto(valor) {
    if (typeof valor !== "string") return "";
    return valor.trim();
  }

  #normalizarBoolean(valor) {
    // aceita true/false, "true"/"false", 1/0
    if (typeof valor === "boolean") return valor;
    if (typeof valor === "string") return valor.toLowerCase() === "true";
    if (typeof valor === "number") return valor === 1;
    return false;
  }

  #normalizarValorMonetario(valor) {
    const n = Number(valor);
    if (!Number.isFinite(n)) return NaN;
    // arredonda para 2 casas para manter consistência com DECIMAL(10,2)
    return Number(n.toFixed(2));
  }

  #normalizarNumeroParcelas(parcelado, numeroParcelas) {
    if (!parcelado) return 1;

    const n = Number(numeroParcelas);
    if (!Number.isInteger(n)) return NaN;
    return n;
  }

  #normalizarDiaFechamento(diaFechamento) {
    const n = Number(diaFechamento);
    if (!Number.isInteger(n) || n < 1 || n > 28) {
      throw new ValidationError("Dia de fechamento inválido (1..28).");
    }
    return n;
  }

  /**
   * Aceita:
   * - "YYYY-MM-DD"
   * - "DD/MM/YYYY"
   * Retorna sempre "YYYY-MM-DD"
   */
  #normalizarData(data) {
    if (typeof data !== "string" || !data.trim()) {
      throw new ValidationError("Data da compra é obrigatória.");
    }

    const raw = data.trim();

    // Caso ISO (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

    // Caso BR (DD/MM/YYYY)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
      const [dd, mm, yyyy] = raw.split("/");
      return `${yyyy}-${mm}-${dd}`;
    }

    throw new ValidationError("Formato de data inválido. Use YYYY-MM-DD (recomendado) ou DD/MM/YYYY.");
  }

  #calcularValorParcela(valorTotal, numeroParcelas) {
    // Regra simples: valorParcela = total / parcelas (arredondado)
    // O total original fica em valorTotal para referência.
    const v = valorTotal / numeroParcelas;
    return Number(v.toFixed(2));
  }

  /**
   * Regra do mês de referência (primeiroMesRef):
   * - Se o dia da compra <= diaFechamento: entra no mês da compra
   * - Se o dia da compra > diaFechamento: entra no mês seguinte
   *
   * Retorna sempre no formato: "YYYY-MM-01"
   */
  #calcularPrimeiroMesRef(dataCompraYYYYMMDD, diaFechamento) {
    const [anoStr, mesStr, diaStr] = dataCompraYYYYMMDD.split("-");
    const ano = Number(anoStr);
    const mes = Number(mesStr);
    const dia = Number(diaStr);

    if (!Number.isInteger(ano) || !Number.isInteger(mes) || !Number.isInteger(dia)) {
      throw new ValidationError("Data da compra inválida.");
    }

    // mês base
    let anoRef = ano;
    let mesRef = mes;

    if (dia > diaFechamento) {
      // vai para o próximo mês
      const prox = this.#somarMes(anoRef, mesRef, 1);
      anoRef = prox.ano;
      mesRef = prox.mes;
    }

    return `${String(anoRef).padStart(4, "0")}-${String(mesRef).padStart(2, "0")}-01`;
  }

  /**
   * Gera lista de meses impactados:
   * Ex: primeiroMesRef=2026-01-01, parcelas=3 =>
   * [{ano:2026,mes:1},{ano:2026,mes:2},{ano:2026,mes:3}]
   */
  #gerarMesesImpactados(primeiroMesRefYYYYMM01, numeroParcelas) {
    const [anoStr, mesStr] = primeiroMesRefYYYYMM01.split("-");
    const ano = Number(anoStr);
    const mes = Number(mesStr);

    const meses = [];
    for (let i = 0; i < numeroParcelas; i++) {
      const { ano: a, mes: m } = this.#somarMes(ano, mes, i);
      meses.push({ ano: a, mes: m });
    }
    return meses;
  }

  /**
   * Soma meses mantendo ano correto.
   * mes é 1..12
   */
  #somarMes(ano, mes, add) {
    const base = new Date(Date.UTC(ano, mes - 1, 1));
    base.setUTCMonth(base.getUTCMonth() + add);

    return {
      ano: base.getUTCFullYear(),
      mes: base.getUTCMonth() + 1,
    };
  }
}
