import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';


describe('Mocks API', () => {
  //users
  it('debería devolver usuarios mock', async () => {
    const response = await request(app).get('/api/mocks/users?qty=5');

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.payload).to.be.a('array');
    expect(response.body.payload[0]).to.include.keys('firstName', 'lastName', 'email');
    expect(response.body.payload[0]).to.not.have.property('password');
    expect(response.body.payload.length).to.equal(5);
  });

  //orders
  it('debería devolver orders mock', async () => {

    await ProductModel.create({
      name: 'Motorola',
      quantity: 3,
      price: 2000,
      status: 'available'
    });

    const response = await request(app).get('/api/mocks/orders?qty=5');

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.payload).to.be.a('array');
    expect(response.body.payload[0]).to.include.keys('customer', 'store', 'items', 'total');
    expect(response.body.payload[0].status).to.equal('created');
    expect(response.body.payload.length).to.equal(5);
  });

  //deliveries
  it('debería devolver deliveries mock', async () => {
    const response = await request(app).get('/api/mocks/deliveries?qty=5');

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.payload).to.be.a('array');
    expect(response.body.payload.length).to.equal(5);
  });

  //drivers
  it('debería devolver drivers mock', async () => {
    const response = await request(app).get('/api/mocks/drivers?qty=5');

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.payload).to.be.a('array');
    expect(response.body.payload.length).to.equal(5);
  });

  it('deberia de devolver los datos guardados', async () => {
    const response = await request(app).post('/api/mocks/seed?type=users&qty=5');

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal('success');
    expect(response.body.payload).to.be.an('object');
    expect(response.body.payload.insertados).to.equal(5);
    expect(response.body.payload.coleccion).to.equal('users');

    const saved = await UserModel.countDocuments();

    expect(saved).to.equal(5);
  });
});


describe('Mocks API errors', () => {

  it('deberia responder error 404 si el tipo de seed no existe', async () => {
    const response = await request(app).post('/api/mocks/seed?type=invalido&qty=5');

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('TYPE_NOT_FOUND');
    expect(response.body.message).to.equal('Tipo no encontrado');
  })

  it('debería responder error 400 si la cantidad es inválida', async () => {
    const response = await request(app).post('/api/mocks/seed?type=users&qty=0');

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('INVALID_QUANTITY');
    expect(response.body.message).to.equal('El formato de la cantidad es incorrecto');
  });

  it('deberia responder error 404 si no hay usuarios para generar ordenes', async () => {
    const response = await request(app).post('/api/mocks/seed?type=orders&qty=3');

    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal('USER_NOT_FOUND');
    expect(response.body.message).to.equal('Usuario no encontrado');
  });

  it('deberia responder error 400 si no hay órdenes guardadas', async () => {
    const response = await request(app).get('/api/mocks/orders?qty=2');

    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('NO_SAVED_PRODUCTS');
    expect(response.body.message).to.equal('No hay productos cargados para generar órdenes');
  });
});