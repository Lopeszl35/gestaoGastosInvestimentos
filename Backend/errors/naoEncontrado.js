import ErroBase from "./Errobase.js";

 export default class NaoEncontrado extends ErroBase {
    constructor(mensagem = "Página não encontrada.") {
        super(mensagem, 404);
    }
}