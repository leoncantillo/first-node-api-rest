import express from 'express';
import config from './config.js';
import clients from './modules/clients/routes.js';
import error from './net/errors.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('port', config.app.port);
app.use('/api/v01/clients', clients);
app.use(error);

export default app;