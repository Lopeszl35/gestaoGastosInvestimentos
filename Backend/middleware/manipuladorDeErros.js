import ErroBase from "../errors/Errobase.js";
import RequisicaoIncorreta from "../errors/RequisicaoIncorreta.js";
import ErroSqlHandler from "../errors/ErroSqlHandler.js";

// eslint-disable-next-line no-unused-vars
function manipuladorDeErros(erro, req, res, next) {
  // 1) Erros da sua aplicação
  if (erro instanceof ErroBase) {
    return erro.enviarResposta(res);
  }

  // 2) Erros de requisição incorreta
  if (erro instanceof RequisicaoIncorreta) {
    return erro.enviarResposta(res);
  }


  // 3) fallback
  console.error("Erro não tratado:", erro);
  return new ErroBase().enviarResposta(res);
}

export default manipuladorDeErros;
