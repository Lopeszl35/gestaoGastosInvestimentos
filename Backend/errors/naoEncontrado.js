import ErroBase from "./Errobase.js";

 export default class NaoEncontrado extends ErroBase {
     constructor(message = 'Recurso não encontrado', details = null) {
        super(message, 404, details, "NOT_FOUND");
    }
}