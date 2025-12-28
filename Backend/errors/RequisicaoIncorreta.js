import ErroBase from "./Errobase.js";

class RequisicaoIncorreta extends ErroBase {
    constructor(message = 'Requisição inválida', erros = []) {
        super(message, 400, "BAD_REQUEST", erros);
    }
}

export default RequisicaoIncorreta