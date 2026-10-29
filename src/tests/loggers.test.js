import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

describe('Loggers', () => {
    it('deberia de responder con status 200', async () => {
        const response = await request(app).get('/loggerTest');

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body).to.have.property('message');
    });
});