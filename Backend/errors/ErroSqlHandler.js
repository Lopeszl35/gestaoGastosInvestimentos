import ErroBase from "./Errobase.js";
import RequisicaoIncorreta from "./RequisicaoIncorreta.js";

class ErroSqlHandler {

  static tratarErroSql(error) {
    if (!error || !error.code) {
      throw error; // erro que não veio do SQL
    }

    switch (error.code) {
      case "ER_DUP_ENTRY":
        throw this.erroDuplicado(error);

      case "ER_BAD_FIELD_ERROR":
        throw this.erroCampoInvalido(error);

      case "ER_BAD_NULL_ERROR":
        throw this.erroCampoNulo(error);

      case "ER_NO_SUCH_TABLE":
        throw this.erroTabelaNaoEncontrada(error);

      case "ER_BAD_FIELD_ERROR":
        throw this.erroCampoInvalido(error);

      case "WARN_DATA_TRUNCATED":
        throw this.erroDadoTruncado(error);

      case "ER_SIGNAL_EXCEPTION":
        

      default:
        throw new ErroBase(
          "Erro interno no banco de dados.",
          500
        );
    }
  }

  // -----------------------------
  // MAPEAMENTOS
  // -----------------------------

  static erroDuplicado(error) {
    if (error.message.includes("email")) {
      return new RequisicaoIncorreta("Email já cadastrado.");
    }

    return new ErroBase("Registro duplicado.", 409);
  }

  static erroCampoNulo(error) {
    const campo = this.extrairCampo(error.message);

    return new RequisicaoIncorreta(
      "Campos obrigatórios não informados.",
      campo ? [`Campo '${campo}' é obrigatório.`] : null
    );
  }

  static erroTabelaNaoEncontrada(error) {
    return new ErroBase(
      "Tabela necessária não encontrada no banco de dados. Entre em contato com o desenvolvedor.",
      500
    );
  }

  static erroCampoInvalido(error) {
    return new RequisicaoIncorreta(
      "Campo inválido informado na requisição."
    );
  }

  static erroDadoTruncado(error) {
    return new RequisicaoIncorreta(
      "Valor inválido ou muito grande para algum campo."
    );
  }

  // -----------------------------
  // UTIL
  // -----------------------------
  static extrairCampo(message) {
    // ER_BAD_NULL_ERROR: Column 'nome' cannot be null
    const match = message.match(/Column '(.+?)'/);
    return match ? match[1] : null;
  }
}

export default ErroSqlHandler;
