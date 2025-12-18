import RequisicaoIncorreta from "../../../errors/RequisicaoIncorreta.js";

export default function ValidarGastos(id_usuario, { valor, data_gasto, id_categoria, descricao }) {
  const erros = [];

  // id_usuario vem em formato string do req.query
  const idUsuario = Number(id_usuario);
  if (!Number.isInteger(idUsuario) || idUsuario <= 0){
    erros.push("id do usuário não fornecido ou invalído")
  }

  const valorNum = valor
  if (!Number.isFinite(valorNum)) {
    erros.push("Valor não informado ou valor incorreto");
  } else if (valorNum <= 0){
    erros.push("valor deve ser maior que 0")
  }

 // Valores de data geralmente vem em formato de string do front
 if (!data_gasto) {
    erros.push("Data do gasto não informado")
 } else {
    const data = new Date(data_gasto);
    if (Number.isNaN(data.getTime())) {
        erros.push("Data informada em formato incorreto")
    }
 }

 if (id_categoria !== undefined) {
    const idCatNum = Number(id_categoria);
    if (!Number.isInteger(idCatNum) || idCatNum <= 0) {
        erros.push("id da categoria não informado")
    }
 }

 if (typeof descricao !== "string") {
    erros.push("Descrição em formato invalído")
 }

  if (erros.length > 0) {
    throw new RequisicaoIncorreta("Dados invalídos", erros);
  }
}
