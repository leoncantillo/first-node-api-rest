import express from 'express';
import answers from '../../net/answers.js';

const router = express.Router();

router.get('/', (req, res) => {
    answers.success(req, res, 'Todo Ok desde clientes', 200);
});

export default router;