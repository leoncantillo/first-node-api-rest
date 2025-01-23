import db from '../../db/database.js';

const TABLE = 'clients';

const controller = {
    all: (req, res) => {
        return db.all(TABLE);
    }
};

export default controller;