import dotenv from 'dotenv';

dotenv.config();

const config = {
    app: {
        port: process.env.PORT || 4000,
    },
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'example',
        port: process.env.DB_PORT || 5432
    }
};

export default config;