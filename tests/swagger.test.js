import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import swaggerSpecs from '../src/config/swagger.config.js';

describe('Docs API', () => {
  it('debería servir la documentación de Swagger', async () => {
    const response = await request(app).get('/api/docs/');

    expect(response.status).to.equal(200);
    expect(response.headers['content-type']).to.include('text/html');
    expect(response.text).to.include('Swagger UI');
  });
});

describe('Docs API errors', () => {
  it('el 404 real coincide con el 404 documentado en Swagger', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const response = await request(app).get(`/api/users/${id}`);

    const documented = swaggerSpecs.paths['/api/users/{uid}'].get.responses['404'];

    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal(documented.content['application/json'].example);
  });
});
