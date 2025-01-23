import pkg from 'pg';
import config from '../config.js';

const dbConfig = {
    user: config.database.user,
    host: config.database.host,
    database: config.database.database,
    password: config.database.password,
    port: config.database.port
};

let connection;

function connectionDB() {
    connection = new pkg.Client(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('[Connection error]', err.stack);
            setTimeout(connectionDB, 2000);
        } else {
            console.log('Connected');
        }
    });

    connection.on('error', (err) => {
        console.error('[Connection error]', err.stack);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectionDB();
        } else {
            throw err;
        }
    });
}

connectionDB();

const database = {
    all: (table) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ${table}`;
            connection.query(query, (error, result) => {
                if (error) {
                    console.error('[Query Error]', __dirname, '\n', error);
                    return reject(error);
                }
                resolve(result.rows);
            });
        });
    },
    one: (table, id) => { },
    create: (table, data) => { },
    update: (table, id, data) => { },
    remove: (table, id) => { },
};

export default database;