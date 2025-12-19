import express from 'express';
import cors from 'cors';

const router = express.Router();

router.use(cors());

export default (gastoMesController) => {

    // rota para obter a meta de limite imposta no mês pelo usuário
    router.get('/getLimiteGastoMes' , (req, res) => {
        gastoMesController.getGastoLimiteMes(req, res)
    });

    // rota para configurar a meta de limite de gastos do mês do usuário
    router.post('/configGastoLimiteMes/:id_usuario', (req, res, next) => {
        gastoMesController.configGastoLimiteMes(req, res, next);
    });

    // Gerar relatorio que voltara dados de gastos de todo o perído de todas as categorias
    router.get('/relatorioGastos', (req, res, next) => {
        gastoMesController.getGastosTotaisPorCategoria(req, res, next);
    })

    return router;
}

