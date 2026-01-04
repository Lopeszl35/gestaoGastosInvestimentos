import express from 'express';
import cors from 'cors';
import { 
    validateCreateUser, 
    validateLoginUser, 
    validateGetUserSaldo, 
    validateUserSaldo,
    validateUpdateUser,
    validateDeleteUser
} from './validateUsers.js';

const router = express.Router();
router.use(cors());

export default (userController) => {
    router.post('/createUser', (req, res, next) => {
        userController.createUser(req, res, next);
    });

    router.post('/loginUser', (req, res, next) => {
        userController.loginUser(req, res, next);
    })

    router.get('/userSaldo', validateGetUserSaldo, (req, res, next) => {
        userController.getUserSaldo(req, res, next);
    });

    router.put('/userSaldo', validateUserSaldo, (req, res, next) => {
        userController.atualizarUserSaldo(req, res, next);
    });

    router.put('/atualizarUsuario/:userId', validateUpdateUser, (req, res, next) => {
        userController.atualizarUsuario(req, res, next);
    })

    router.get('/userData/:userId', (req, res, next) => {
        userController.getUserData(req, res, next);
    })

    router.delete('/deleteUser/:userId', validateDeleteUser, (req, res, next) => {
        userController.deleteUser(req, res, next);
    })

    return router;
};
