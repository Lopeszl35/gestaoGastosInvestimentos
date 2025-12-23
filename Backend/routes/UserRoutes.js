import express from 'express';
import cors from 'cors';
import { validateCreateUser, validateLoginUser } from '../middleware/validates/validateUsers.js';

const router = express.Router();
router.use(cors());

export default (userController) => {
    router.post('/createUser', validateCreateUser, (req, res, next) => {
        userController.createUser(req, res, next);
    });

    router.post('/loginUser', validateLoginUser, (req, res, next) => {
        userController.loginUser(req, res, next);
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
