import express from 'express';
import cors from 'cors';

const router = express.Router();

router.use(cors());

export default (gastoMesController) => {

    router.post('/configGastoLimiteMes', (req, res) => {
        gastoMesController.configGastoLimiteMes(req, res);
    });

    return router;
}

