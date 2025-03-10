import database from '../../db/database.js';
const TABLE = 'clients';

function controller(db = database) {
    const clientController = {
        all: () => db.all(TABLE),
        one: (id) => db.one(TABLE, id),
        create: (body) => db.create(TABLE, body),
        remove: (body) => db.remove(TABLE, body),
    };

    return clientController;
}

export default controller;