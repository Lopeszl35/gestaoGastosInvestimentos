import ErroBase from "../errors/Errobase.js";

export default class NaoEncontrado extends ErroBase {
  constructor(message = "Recurso não encontrado", details = []) {
    super(message, 404, "NOT_FOUND", details);
  }
}
