import db from '../../db/database.js';

const TABLE = 'clients';

const controller = {
    all: () => db.all(TABLE),
    one: (id) => db.one(TABLE, id),
    create: (body) => db.create(TABLE, body),
    remove: (body) => db.remove(TABLE, body),
};

export default controller;