import { config } from 'dotenv';

config();
const required = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Falta la variable de entorno obligatoria: ${key}`)
    };
}

export const env = {
    port: Number(process.env.PORT),
    mongodb_uri: process.env.MONGODB_URI,
    node_env: process.env.NODE_ENV
}