import RequisicaoIncorreta from "./RequisicaoIncorreta.js";

export default function validarEntradaGastoMes({ id_usuario, dadosMes }) {
  const erros = [];

  if (!id_usuario) {
    erros.push("id do usuário não informado");
  }

  if (!dadosMes || typeof dadosMes !== "object") {
    erros.push("Informações fornecidas inválidas");
  } else {
    if (
      dadosMes.limiteGastoMes === undefined ||
      dadosMes.limiteGastoMes === null
    ) {
      erros.push("Informar limite de gasto do mês é obrigatório");
    } else if (isNaN(Number(dadosMes.limiteGastoMes))) {
      erros.push("Valor inválido para limite de gasto do mês");
    }

    if (!dadosMes.mes) {
      erros.push("Mês atual inválido ou não informado");
    }
  }

  if (erros.length > 0) {
    throw new RequisicaoIncorreta("Dados inválidos", erros);
  }
}
