import ErroBase from "../errors/Errobase.js";
import RequisicaoIncorreta from "../errors/RequisicaoIncorreta.js";
import ErroSqlHandler from "../errors/ErroSqlHandler.js";

// eslint-disable-next-line no-unused-vars
export default function manipuladorDeErros(err, req, res, next) {
    if (err instanceof ErroBase) {
        console.log('Erro tratado:', err);
        return res.status(err.statusCode).json({
            message: err.message,
            code: err.code,
            details: err.erros,
        });
    } 

    // Erro desconhecido (programming error / bug / lib)
    console.error('Erro não tratado:', err);

    return res.status(500).json({
        message: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR',
        error: err,
    });
}
