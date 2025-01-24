import answers from "./answers.js";
import path from 'path';

function errors(err, req, res, next) {
    console.error({
        "errorPath": path.resolve(),
        "err": err.stack
    });

    const message = err.message || 'Internal Error';
    const status = err.statusCode || 500;

    answers.error(req, res, message, status);
};

export default errors;