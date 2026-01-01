import express from 'express';
import cors from 'cors';
import { 
    validateGetLimiteGastoMes,
    validateConfigGastoLimiteMes,
    validateGetGastosTotaisPorCategoria,
    validateAddGasto
} from './GastoMesValidate.js';

const router = express.Router();


router.use(cors());

export default (gastoMesController) => {

    // rota para obter a meta de limite imposta no mês pelo usuário
    router.get('/getLimiteGastoMes', validateGetLimiteGastoMes , (req, res, next) => {
        gastoMesController.getGastoLimiteMes(req, res, next);
    });

    // rota para configurar a meta de limite de gastos do mês do usuário
    router.post('/configGastoLimiteMes/:id_usuario', validateConfigGastoLimiteMes, (req, res, next) => {
        gastoMesController.configGastoLimiteMes(req, res, next);
    });

    // Gerar relatorio que voltara dados de gastos de todo o perído de todas as categorias
    router.get('/relatorioGastos', validateGetGastosTotaisPorCategoria, (req, res, next) => {
        gastoMesController.getGastosTotaisPorCategoria(req, res, next);
    })

     router.post("/addGasto", (req, res, next) => {
     gastoMesController.addGasto(req, res, next);
  });

    return router;
}

