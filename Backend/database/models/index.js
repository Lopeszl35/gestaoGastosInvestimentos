import { CartaoCreditoModel } from "./cartoesCredito/CartaoCreditoModel.js";
import { CartaoFaturaModel } from "./cartoesCredito/CartaoFaturaModel.js";
import { CartaoLancamentoModel } from "./cartoesCredito/CartaoLancamentoModel.js";

export function configurarRelacionamentosModelos() {
  CartaoCreditoModel.hasMany(CartaoFaturaModel, {
    foreignKey: "id_cartao",
    sourceKey: "idCartao",
  });

  CartaoCreditoModel.hasMany(CartaoLancamentoModel, {
    foreignKey: "id_cartao",
    sourceKey: "idCartao",
  });
}

export { CartaoCreditoModel, CartaoFaturaModel, CartaoLancamentoModel };
