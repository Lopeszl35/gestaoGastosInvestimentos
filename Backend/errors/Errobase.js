class ErroBase extends Error {
    constructor(menssagem = "Erro interno", status = 500, erros) {
        super();
        this.message = menssagem;
        this.status = status;
        this.erros = erros;
    }

    enviarResposta(res) {
        res.status(this.status).send({
            message: this.message,
            status: this.status,
            erros: this.erros
        })
    }

}

export default ErroBase