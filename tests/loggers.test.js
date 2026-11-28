import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import logger from '../src/config/logger.js';

describe('Loggers', () => {
    it('deberia de responder con status 200', async () => {
        const response = await request(app).get('/loggerTest');

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.equal('logs generados correctamente');
    });
});

describe('Logger files', () => {
    if ('crea error.log y combined.log', async () => {
        logger.error('prueba');
        await new Promise((resolve) => setTimeout(resolve, 300));


        expect(fs.existsSync('logs/error.log')).to.equal(true);
        expect(fs.existsSync('logs/combined.log')).to.equal(true);
    });
});

describe('Loggers errors', () => {
    it('debería responder 404 por ruta no encontrada', async () => {
        const response = await request(app).post('/loggerTest');

        expect(response.status).to.equal(404)
        expect(response.body.status).to.equal('error')
        expect(response.body.error).to.equal('ROUTE_NOT_FOUND');
        expect(response.body.message).to.equal('Ruta no encontrada');
    });
});