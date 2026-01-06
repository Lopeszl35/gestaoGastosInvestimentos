import RequisicaoIncorreta from "../../../errors/RequisicaoIncorreta.js";

export class CartaoCreditoEntity {
  constructor({ uuid_cartao, nome, bandeira, ultimos4, corHex, limite, diaFechamento, diaVencimento, ativo = true }) {
    this.uuid_cartao = uuid_cartao;
    this.nome = nome;
    this.bandeira = bandeira;
    this.ultimos4 = ultimos4;
    this.corHex = corHex;
    this.limite = Number(limite ?? 0);
    this.diaFechamento = Number(diaFechamento);
    this.diaVencimento = Number(diaVencimento);
    this.ativo = Boolean(ativo)

    this._validarDominio();

  }

  _validarDominio() {
    if (!this.nome || this.nome.length < 2) {
      throw new RequisicaoIncorreta("Nome do cartão inválido.");
    }
    if (!Number.isFinite(this.limite) || this.limite < 0) {
      throw new RequisicaoIncorreta("Limite do cartão inválido.");
    }
    if (!(this.diaFechamento >= 1 && this.diaFechamento <= 28)) {
      throw new RequisicaoIncorreta("diaFechamento inválido.");
    }
    if (!(this.diaVencimento >= 1 && this.diaVencimento <= 28)) {
      throw new RequisicaoIncorreta("diaVencimento inválido.");
    }
    if (this.ultimos4 && !/^\d{4}$/.test(this.ultimos4)) {
      throw new RequisicaoIncorreta("ultimos4 inválido.");
    }
    if (this.corHex && !/^#([0-9a-fA-F]{6})$/.test(this.corHex)) {
      throw new RequisicaoIncorreta("corHex inválido.");
    }
  }

  calcularLimiteDisponivel(limiteUsado) {
    const usado = Number(limiteUsado ?? 0);
    const disponivel = this.limite - usado;
    return disponivel < 0 ? 0 : Number(disponivel.toFixed(2));
  }

  calcularPercentualUsado(limiteUsado) {
    const usado = Number(limiteUsado ?? 0);
    if (!this.limite || this.limite <= 0) return 0;
    const percentual = (usado / this.limite) * 100;
    return Math.max(0, Math.min(100, Math.round(percentual)));
  }
}
