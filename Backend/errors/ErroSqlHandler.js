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

      case "ER_NO_DEFAULT_FOR_FIELD":
        throw this.erroCampoSemDefault(error);

      case "ER_NO_SUCH_TABLE":
        throw this.erroTabelaNaoEncontrada(error);

      case "WARN_DATA_TRUNCATED":
        throw this.erroDadoTruncado(error);

      case "ER_SIGNAL_EXCEPTION":
        // Se você usa SIGNAL no banco, dá pra tratar aqui depois.
        // Por enquanto cai no genérico com a mensagem original.
        throw new ErroBase("Erro interno no banco de dados.", 500);

      default:
        throw new ErroBase("Erro interno no banco de dados.", 500);
    }
  }

  // -----------------------------
  // MAPEAMENTOS
  // -----------------------------

  static erroDuplicado(error) {
    const msg = this._getMensagemSql(error);

      if (msg.includes("uq_cartao_unico_usuario_ativo")) {
        return new RequisicaoIncorreta("Cartão já cadastrado.");
      }

    // mantém sua regra atual
    if (msg.includes("email")) {
      return new RequisicaoIncorreta("Email já cadastrado.");
    }

    // melhora: tenta descobrir qual chave/coluna foi duplicada
    const chave = this.extrairChaveDuplicada(msg);
    if (chave) {
      return new ErroBase("Registro duplicado.", 409, [`Chave duplicada: '${chave}'.`]);
    }

    return new ErroBase("Registro duplicado.", 409);
  }

  static erroCampoNulo(error) {
    const msg = this._getMensagemSql(error);
    const campo =
      this.extrairCampoPorColumnCannotBeNull(msg) ||
      this.extrairCampoPorField(msg) ||
      this.extrairCampoPorColumn(msg);

    return new RequisicaoIncorreta(
      "Campos obrigatórios não informados.",
      campo ? [`Campo '${campo}' é obrigatório.`] : null
    );
  }

  static erroCampoSemDefault(error) {
    // Ex: "Field 'uuid_cartao' doesn't have a default value"
    const msg = this._getMensagemSql(error);
    const campo = this.extrairCampoPorFieldNoDefault(msg);

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
    const msg = this._getMensagemSql(error);

    // melhora: pega o campo exato quando for "Unknown column 'x' in 'field list'"
    const campo =
      this.extrairCampoUnknownColumn(msg) ||
      this.extrairCampoPorColumn(msg);

    return new RequisicaoIncorreta(
      campo
        ? "Campo inválido informado na requisição."
        : "Campo inválido informado na requisição.",
      campo ? [`Campo inválido: '${campo}'.`] : null
    );
  }

  static erroDadoTruncado(error) {
    return new RequisicaoIncorreta("Valor inválido ou muito grande para algum campo.");
  }

  // -----------------------------
  // UTIL (mantém a sua e melhora)
  // -----------------------------

  /**
   * Mantive sua função, mas agora ela usa _getMensagemSql()
   * e tenta outros padrões também.
   */
  static extrairCampo(message) {
    if (!message) return null;
    // ER_BAD_NULL_ERROR: Column 'nome' cannot be null
    const match = message.match(/Column '(.+?)'/i);
    return match ? match[1] : null;
  }

  // =============================
  // 🔎 EXTRATORES NOVOS
  // =============================

  static _getMensagemSql(error) {
    // para SQL puro: geralmente vem em error.message
    // para mysql2/mariadb: pode vir em error.sqlMessage
    return String(error.sqlMessage || error.message || "");
  }

  // "Unknown column 'ultimos_4' in 'field list'"
  static extrairCampoUnknownColumn(message) {
    if (!message) return null;
    const match = message.match(/Unknown column '(.+?)'/i);
    return match ? match[1] : null;
  }

  // "Column 'nome' cannot be null"
  static extrairCampoPorColumnCannotBeNull(message) {
    if (!message) return null;
    const match = message.match(/Column '(.+?)' cannot be null/i);
    return match ? match[1] : null;
  }

  // "Column 'x'..."
  static extrairCampoPorColumn(message) {
    if (!message) return null;
    const match = message.match(/Column '(.+?)'/i);
    return match ? match[1] : null;
  }

  // "Field 'uuid_cartao' doesn't have a default value"
  static extrairCampoPorFieldNoDefault(message) {
    if (!message) return null;
    const match = message.match(/Field '(.+?)' doesn't have a default value/i);
    return match ? match[1] : null;
  }

  // fallback: "Field 'x' ..."
  static extrairCampoPorField(message) {
    if (!message) return null;
    const match = message.match(/Field '(.+?)'/i);
    return match ? match[1] : null;
  }

  // "Duplicate entry '...' for key 'uq_cartoes_credito_uuid'"
  static extrairChaveDuplicada(message) {
    if (!message) return null;
    const match = message.match(/for key '(.+?)'/i);
    return match ? match[1] : null;
  }
}

export default ErroSqlHandler;
