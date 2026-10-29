import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';
import UserModel from '../models/user.model.js';


describe('Mocks API', () => {
  it('debería devolver usuarios mock', async () => {
    const response = await request(app).get('/api/mocks/users?qty=5');

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.payload).to.be.a('array');
    expect(response.body.payload[0]).to.include.keys('firstName', 'lastName', 'email');
    expect(response.body.payload[0]).to.not.have.property('password');
    expect(response.body.payload.length).to.equal(5);
  });

  it('deberia de devolver los datos guardados', async () => {
    const response = await request(app).post('/api/mocks/seed?type=users&qty=5');

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal('success');
    expect(response.body.payload).to.be.an('object');

    const saved = await UserModel.countDocuments();

    expect(saved).to.equal(5);
  });
});


describe('Mocks API errors', () => {
  it('debería responder error si la cantidad es inválida', async () => {
    const response = await request(app).get('/api/mocks/users?qty=-1');

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('INVALID_QUANTITY');
    expect(response.body.message).to.equal('El formato de la cantidad es incorrecto');
  });
});