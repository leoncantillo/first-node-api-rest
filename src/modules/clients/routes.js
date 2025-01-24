import express from 'express';
import answers from '../../net/answers.js';
import controller from './controller.js';

const router = express.Router();

router.get('/', all);
router.get('/:id', one);
router.post('/', create);
router.put('/', remove);

async function all(req, res, next) {
    await controller.all()
        .then((items) => {
            answers.success(req, res, items, 200);
        })
        .catch((err) => {
            next(err);
        });
}

async function one(req, res, next) {
    await controller.one(req.params.id)
        .then((item) => {
            answers.success(req, res, item, 200);
        })
        .catch((err) => {
            next(err);
        });
}

async function create(req, res, next) {
    await controller.create(req.body)
        .then(() => {
            answers.success(req, res, 'Item Successfully Created', 200);
        })
        .catch((err) => {
            next(err);
        });
}

async function remove(req, res, next) {
    await controller.remove(req.body)
        .then(() => {
            answers.success(req, res, 'Satisfactory removal', 200);
        })
        .catch((err) => {
            next(err);
        });
}

export default router;