import express from 'express';
import answers from '../../net/answers.js';
import controller from './controller.js';

const router = express.Router();

router.get('/', async (req, res) => {
    await controller.all()
        .then((items) => {
            answers.success(req, res, items, 200);
        })
        .catch((err) => {
            console.error('[Error getting the database]:', err);
            answers.error(req, res, null, 500);
        });;
});

export default router;