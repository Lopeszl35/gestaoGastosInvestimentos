class ErroBase extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', erros = []) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.erros = erros;

        // Captura a pilha de chamadas (stack trace) correta, Mantém a referência ao construtor da classe
        Error.captureStackTrace?.(this, this.constructor);
    }

}

export default ErroBase