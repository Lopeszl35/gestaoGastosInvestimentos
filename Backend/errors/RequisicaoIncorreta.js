import ErroBase from "./Errobase.js";

class RequisicaoIncorreta extends ErroBase {
    constructor(mensagem = "Um ou mais dados fornecidos estão incorretos", erros){
        super(mensagem, 400, erros);
    }
}

export default RequisicaoIncorreta