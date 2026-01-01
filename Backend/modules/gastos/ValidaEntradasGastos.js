import ErroValidacao from "../../errors/ValidationError.js";
import RequisicaoIncorreta from "../../errors/RequisicaoIncorreta.js";

export default class ValidaEntradas {
  
  static validaAnoMes(ano, mes) {
    const erros = [];

    if (!ano || isNaN(Number(ano))) {
      erros.push("Ano inválido ou não informado");
    }

    if (!mes || isNaN(Number(mes)) || mes < 1 || mes > 12) {
      erros.push("Mês inválido. Deve ser entre 1 e 12");
    }

    if (erros.length > 0) {
      throw new RequisicaoIncorreta(
        "Erro de validação de data (ano/mês)",
        erros
      );
    }

    return true;
  }

   static ValidarGastos(id_usuario, gasto) {
    const erros = [];

    const idUsuario = Number(id_usuario);
    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
      erros.push("Id do usuário inválido.");
    }

    const valorNum = Number(gasto.valor);
    if (!Number.isFinite(valorNum)) {
      erros.push("Valor não informado ou inválido.");
    } else if (valorNum <= 0) {
      erros.push("Valor deve ser maior que zero.");
    }

    if (!gasto.data_gasto) {
      erros.push("Data do gasto não informada.");
    } else {
      const data = new Date(gasto.data_gasto);
      if (Number.isNaN(data.getTime())) {
        erros.push("Data do gasto em formato inválido.");
      }
    }

    if (gasto.id_categoria !== undefined) {
      const idCat = Number(gasto.id_categoria);
      if (!Number.isInteger(idCat) || idCat <= 0) {
        erros.push("Categoria inválida.");
      }
    }

    if (gasto.descricao !== undefined) {
      if (typeof gasto.descricao !== "string") {
        erros.push("Descrição deve ser texto.");
      } else if (gasto.descricao.length > 255) {
        erros.push("Descrição excede 255 caracteres.");
      }
    }

    if (erros.length > 0) {
      throw new ErroValidacao("Erro de validação do gasto", erros);
    }
  }

  static validarEntradaLimiteGastoMes({ id_usuario, dadosMes }) {
    console.log("ValidarEntradaLimiteGastoMes chamado com:", { id_usuario, dadosMes });
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
      } else if (isNaN(Number(dadosMes.mes)) || dadosMes.mes < 1 || dadosMes.mes > 12) {
        erros.push("Mês inválido. Deve ser entre 1 e 12");
      }

      if( !dadosMes.ano ) {
        erros.push("Ano atual inválido ou não informado");
      } else if (isNaN(Number(dadosMes.ano)) || dadosMes.ano < 2000 ) {
        erros.push("Ano inválido. Deve ser um número inteiro válido.");
      }
    }
    
    if (erros.length > 0) {
      throw new ErroValidacao("Requisição inválida", erros);
    }
  }
  
  static validaDatas({ inicio, fim }) {
    // se não mandou nenhuma, ok (relatório do período todo)
    if (!inicio && !fim) return;

    // se mandou só uma, erro
    if ((inicio && !fim) || (!inicio && fim)) {
      throw new RequisicaoIncorreta("Período incompleto", [
        "Envie inicio e fim juntos, ou não envie nenhum.",
      ]);
    }

    const inicioDate = new Date(`${inicio}T00:00:00.000Z`);
    const fimDate = new Date(`${fim}T23:59:59.999Z`);

    if (Number.isNaN(inicioDate.getTime())) {
      throw new RequisicaoIncorreta("Data em formato incorreto", [
        "Campo inicio inválido (use YYYY-MM-DD).",
      ]);
    }

    if (Number.isNaN(fimDate.getTime())) {
      throw new RequisicaoIncorreta("Data em formato incorreto", [
        "Campo fim inválido (use YYYY-MM-DD).",
      ]);
    }

    if (inicioDate > fimDate) {
      throw new RequisicaoIncorreta("Período inválido", [
        "A data inicio não pode ser maior que a data fim.",
      ]);
    }
  }

}

