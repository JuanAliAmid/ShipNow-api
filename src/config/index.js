import { config } from 'dotenv';

config();
const required = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Falta la variable de entorno obligatoria: ${key}`);
    };
};

export const env = {
    port: Number(process.env.PORT) || 3000,
    node_env: process.env.NODE_ENV || 'development',
    isProd: process.env.NODE_ENV === 'production',
    mongodb_uri: process.env.MONGODB_URI
};