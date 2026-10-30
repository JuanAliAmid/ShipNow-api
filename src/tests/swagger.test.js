import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';

describe('Docs API', () => {
  it('debería servir la documentación de Swagger', async () => {
    const response = await request(app).get('/api/docs/');

    expect(response.status).to.equal(200);
    expect(response.headers['content-type']).to.include('text/html');
    expect(response.text).to.include('Swagger UI');
  });
});
