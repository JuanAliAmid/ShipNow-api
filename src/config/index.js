import { config } from 'dotenv';

config();

const nodeEnv = process.env.NODE_ENV || 'development';

const required = nodeEnv === 'test' ? ['MONGODB_URI_TEST'] : ['PORT', 'MONGODB_URI', 'NODE_ENV'];

for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Falta la variable de entorno obligatoria: ${key}`);
    };
};

export const env = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv,
    isProd: nodeEnv === 'production',
    mongodb_uri: nodeEnv === 'test' ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI
};