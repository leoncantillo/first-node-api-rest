import express from 'express';
import config from './config.js';
import clients from './modules/clients/routes.js';

const app = express();

app.set('port', config.app.port);

app.use('/api/v01/clients', clients);

export default app;