import database from '../../db/database.js';
import clients from '../clients/index.js';
const TABLE = 'users';

function controller(db = database) {
    const usersController = {
        all: () => db.all(TABLE),
        one: (id) => db.one(TABLE, id),
        create: async (body) => {
            if (!body.name || !body.lastname)
                return Promise.reject(new Error('The "name" and "lastname" attributes are required.'));

            let userId = body.id;

            // Creating User
            try {
                const answer = await db.create(TABLE, {
                    ...(body.id != null && { id: body.id }),
                    username: body.username,
                    password: body.password
                });

                if (!body.id) userId = answer.data.id;
            } catch (error) {
                return Promise.reject(error);
            }

            // Creating Client
            try {
                await clients.create({
                    user_id: userId,
                    name: body.name,
                    lastname: body.lastname
                });
            } catch (error) {
                usersController.remove(body);
                return Promise.reject(error);
            }

            return true;
        },
        remove: (body) => db.remove(TABLE, body),
    };

    return usersController;
}

export default controller;