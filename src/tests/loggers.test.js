import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';

describe('Loggers', () => {
    it('deberia de responder con status 200', async () => {
        const response = await request(app).get('/loggerTest');

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.equal('logs generados correctamente');
    });
});

describe('Loggers errors', () => {
    it('debería responder 404 por ruta no encontrada', async () => {
        const response = await request(app).post('/rutaInvalida');

        expect(response.status).to.equal(404)
        expect(response.body.status).to.equal('error')
        expect(response.body.error).to.equal('ROUTE_NOT_FOUND');
        expect(response.body.message).to.equal('Ruta no encontrada');
    });
});