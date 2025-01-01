import express from 'express';
import cors from 'cors';

const router = express.Router();
router.use(cors());


export default (categoriasController) => {
    router.post('/createCategorias', (req, res) => {
        categoriasController.createCategorias(req, res);
    });

    router.get('/getCategorias', (req, res) => {
        categoriasController.getCategorias(req, res);
    });

    return router;
};