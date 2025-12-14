import express from 'express';
import cors from 'cors';

const router = express.Router();
router.use(cors());

export default (userController) => {
    router.post('/createUser', (req, res) => {
        userController.createUser(req, res);
    });

    router.post('/loginUser', (req, res) => {
        userController.loginUser(req, res);
    })

    router.get('/userSaldo', (req, res) => {
        userController.getUserSaldo(req, res);
    });

    router.put('/userSaldo', (req, res, next) => {
        userController.atualizarUserSaldo(req, res, next);
    });

    router.get('/userData/:userId', (req, res, next) => {
        userController.getUserData(req, res, next);
    })

    return router;
};
