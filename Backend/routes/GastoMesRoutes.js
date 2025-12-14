import express from 'express';
import cors from 'cors';

const router = express.Router();

router.use(cors());

export default (gastoMesController) => {

    router.get('/getLimiteGastoMes' , (req, res) => {
        gastoMesController.getGastoLimiteMes(req, res)
    });

    router.post('/configGastoLimiteMes/:id_usuario', (req, res, next) => {
        gastoMesController.configGastoLimiteMes(req, res, next);
    });

    return router;
}

