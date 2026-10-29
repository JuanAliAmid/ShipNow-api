import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';

describe('Logger API', () => {
  it('debería generar logs correctamente', async () => {
    const response = await request(app).get('/loggerTest');

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.message).to.equal('logs generados correctamente');
  });
});