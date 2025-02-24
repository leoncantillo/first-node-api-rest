import express from 'express';
import config from './config.js';
import cors from 'cors';
import clients from './modules/clients/routes.js';
import users from './modules/users/routes.js';
import error from './net/errors.js';

const app = express();

var corsOptions = {
    origin: '*',
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('port', config.app.port);
app.use('/api/v01/clients', clients);
app.use('/api/v01/users', users);
app.use(error);

export default app;