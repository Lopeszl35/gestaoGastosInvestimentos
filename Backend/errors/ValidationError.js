import ErroBase from "./Errobase.js";

export default class ErroValidacao extends ErroBase {
  constructor(erros = [], message = "Erro de validação") {
    super(message, 400, "VALIDATION_ERROR", erros);
  }
}
