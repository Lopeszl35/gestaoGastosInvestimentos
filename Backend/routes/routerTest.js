import express from 'express';
import cors from 'cors';

const router = express.Router();
router.use(cors());

router.get('/status', (req, res) => {
    res.status(200).send('Servidor ok');
});

export default router;