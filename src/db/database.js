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
                    return reject(error);
                }
                if (result.rows.length === 0) {
                    return reject(new Error(`No records found in table: ${table}`));
                }
                resolve(result.rows);
            });
        });
    },
    one: (table, id) => {
        return new Promise((resolve, reject) => {
            if (!id) {
                return reject(new Error('ID is required to delete a record'));
            }

            const query = `SELECT * FROM ${table} WHERE id=$1`;
            connection.query(query, [id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result.rows.length === 0) {
                    return reject(new Error(`No record found in table: ${table}, with ID: ${id}`));
                }
                resolve(result.rows);
            });
        });
    },
    create: (table, data) => {
        if (!data) {
            return Promise.reject(new Error('Data is null or undefined'));
        }

        if (typeof data !== 'object') {
            return Promise.reject(new Error('Invalid data: expected an object'));
        }

        if (Object.keys(data).length === 0) {
            return Promise.reject(new Error('Invalid data: object is empty'));
        }

        return (data.id == null ? insert : update)(table, data).catch((error) => {
            return Promise.reject(error);
        });
    },
    remove: (table, data) => {
        return new Promise((resolve, reject) => {
            if (!data) {
                return reject(new Error('Data is null or undefined'));
            }

            if (typeof data !== 'object') {
                return reject(new Error('Invalid data: expected an object'));
            }

            if (Object.keys(data).length === 0) {
                return reject(new Error('Invalid data: object is empty'));
            }

            if (!data.id) {
                return reject(new Error('ID is required to delete a record'));
            }

            const query = `DELETE FROM ${table} WHERE id=$1`;
            connection.query(query, [data.id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result.rowCount === 0) {
                    return reject(new Error(`No record found in table: ${table}, with ID: ${data.id}`));
                }
                resolve({ message: 'Record deleted successfully', affectedRows: result.rowCount });
            });
        });
    },
};

function insert(table, data) {
    return new Promise((resolve, reject) => {
        if (!data) {
            return reject(new Error('Data is null or undefined'));
        }

        if (typeof data !== 'object') {
            return reject(new Error('Invalid data: expected an object'));
        }

        if (Object.keys(data).length === 0) {
            return reject(new Error('Invalid data: object is empty'));
        }

        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map((_, index) => `$${index + 1}`).join(', ');
        const values = Object.values(data);

        const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;

        connection.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve({
                message: 'Record inserted successfully',
                data: result.rows[0],
            });
        });
    });
}

function update(table, data) {
    return new Promise((resolve, reject) => {
        if (!data) {
            return reject(new Error('Data is null or undefined'));
        }

        if (typeof data !== 'object') {
            return reject(new Error('Invalid data: expected an object'));
        }

        if (Object.keys(data).length === 0) {
            return reject(new Error('Invalid data: object is empty'));
        }

        const fields = Object.keys(data)
            .filter((key) => key !== 'id')
            .map((key, index) => `${key}=$${index + 1}`);
        const values = Object.keys(data)
            .filter((key) => key !== 'id')
            .map((key) => data[key]);

        const query = `UPDATE ${table} SET ${fields.join(', ')} WHERE id=$${fields.length + 1}`;
        connection.query(query, [...values, data.id], (error, result) => {
            if (error) {
                return reject(error);
            } else if (result.rowCount === 0) {
                return reject(new Error(`No record found in table: ${table}, with ID: ${data.id}`));
            }
            resolve({ message: 'Record updated successfully' });
        });
    });
}

export default database;