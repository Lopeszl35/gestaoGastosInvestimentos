import express from 'express';
import cors from 'cors';

const router = express.Router();
router.use(cors());

export default (userController) => {
    router.post('/createUser', (req, res) => {
        userController.createUser(req, res);
    });

    return router;
};
