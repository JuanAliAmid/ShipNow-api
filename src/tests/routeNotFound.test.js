import { expect } from "chai";
import request from 'supertest';
import app from "../app.js";

//Ruta no encontrada
describe('Not found routes', () => {
    it('debería responder 404 para una ruta inexistente', async () => {
        const response = await request(app).get('/api/route-that-does-not-exist');

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal('error');
        expect(response.body).to.have.property('message');
        expect(response.body.error).to.equal('ROUTE_NOT_FOUND');
        expect(response.body.message).to.equal('Ruta no encontrada');
    });
});