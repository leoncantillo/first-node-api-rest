export const answers = {
    success: (req, res, message = '', status = 200) => {
        res.status(status).send({
            error: false,
            status: status,
            body: message,
        });
    },
    error: (req, res, message = 'Internal Error', status = 500) => {
        res.status(status).send({
            error: true,
            status: status,
            body: message,
        });
    }
};

export default answers;