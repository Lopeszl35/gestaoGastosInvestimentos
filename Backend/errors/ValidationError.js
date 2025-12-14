import RequisicaoIncorreta from "./RequisicaoIncorreta.js";

class ErroValidacao extends RequisicaoIncorreta {
  constructor(errorsArray) {
    const mensagens = errorsArray.map((e) => e.msg).join("; ");
    super(`Os seguintes erros foram encontrados: ${mensagens}`);
  }
}

export default ErroValidacao;
