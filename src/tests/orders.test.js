import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';
import OrderModel from '../models/order.model.js';
import { orderFixture } from './helpers/orderFixture.js';
import mongoose from 'mongoose';

describe('Orders API', () => {
  //created
  describe('Create order', () => {
    it('crea y persiste un pedido valido', async () => {
      const body = await orderFixture();

      const response = await request(app).post('/api/orders/').send(body);

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal('success');
      expect(response.body.payload._id).to.be.a('string');
      expect(response.body.payload.total).to.equal(6000);
      expect(response.body.payload.status).to.equal("created");
      expect(response.body.payload.customer).to.equal(body.customer);
      expect(response.body.payload.store).to.equal(body.store);

      const saved = await OrderModel.findById(response.body.payload._id);
      expect(saved).to.not.equal(null);
      expect(saved.total).to.equal(6000);
      expect(await OrderModel.countDocuments()).to.equal(1);
    });
  });

  //Get all
  describe('Order list', () => {
    it('debería responder con una lista de pedidos', async () => {

      const body = await orderFixture();
      const createResponse = await request(app).post('/api/orders').send(body);

      const response = await request(app).get('/api/orders');

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.payload).to.have.lengthOf(1);
      expect(response.body.payload[0]._id).to.equal(createResponse.body.payload._id);
      expect(response.body.payload[0].total).to.equal(6000);
      expect(response.body.payload[0].status).to.equal('created');
    });
  });

  // Get by id
  describe('Get order by id', () => {
    it('debería responder con un pedido obtenido por id', async () => {

      const body = await orderFixture();
      const createResponse = await request(app).post(`/api/orders`).send(body);
      const getResponse = await request(app).get(`/api/orders/${createResponse.body.payload._id}`);

      expect(getResponse.status).to.equal(200);
      expect(getResponse.body).to.have.property('status');
      expect(getResponse.body.status).to.equal('success');
      expect(getResponse.body).to.have.property('payload');
      expect(getResponse.body.payload._id).to.equal(createResponse.body.payload._id);
      expect(getResponse.body.payload).to.be.an('object');
    });
  });

  // Update by id
  describe('Update order by id', () => {
    it('debería responder con un pedido actualizado por id', async () => {

      const body = await orderFixture();
      const createResponse = await request(app).post(`/api/orders`).send(body);
      const newStatus = 'assigned';
      const putResponse = await request(app).put(`/api/orders/${createResponse.body.payload._id}/status`).send({ status: newStatus });

      expect(putResponse.status).to.equal(200);
      expect(putResponse.body).to.have.property('status');
      expect(putResponse.body.status).to.equal('success');
      expect(putResponse.body).to.have.property('payload');
      expect(putResponse.body.payload._id).to.equal(createResponse.body.payload._id);
      expect(putResponse.body.payload.status).to.not.equal(createResponse.body.payload.status);
      expect(putResponse.body.payload.status).to.equal(newStatus);
      expect(putResponse.body.payload).to.be.an('object');
    });
  });

  // Delete by id
  describe('Delete order by id', () => {
    it('debería responder con un pedido eliminado por id', async () => {

      const body = await orderFixture();
      const createResponse = await request(app).post(`/api/orders`).send(body);
      const orderId = createResponse.body.payload._id;

      const deleteResponse = await request(app).delete(`/api/orders/${orderId}`);

      expect(deleteResponse.status).to.equal(200);
      expect(deleteResponse.body.status).to.equal('success');

      const getResponse = await request(app).get(`/api/orders/${orderId}`);

      expect(getResponse.status).to.equal(404);
      expect(getResponse.body.status).to.equal('error');
      expect(getResponse.body.error).to.equal('ORDER_NOT_FOUND');
    });
  });
});


describe('Orders API errors', () => {

  // Faltante de alguno de los 4 campos obligatorios
  ['customer', 'store', 'items', 'deliveryAddress'].forEach(camp => {
    it(`debería responder error 400 si falta ${camp}`, async () => {

      const body = await orderFixture();
      delete body[camp];
      const response = await request(app).post('/api/orders').send(body);

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal('error');
      expect(response.body.error).to.equal('REQUIRED_FIELDS');
      expect(response.body.message).to.equal('Faltan datos obligatorios');
    });
  });

  //Items viene vacio
  it("responde 400 si items viene vacio", async () => {

    const body = await orderFixture();
    body.items = [];

    const response = await request(app).post('/api/orders').send(body);

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('INVALID_DATA');
    expect(response.body.message).to.equal('El formato de los datos ingresados es incorrecto');
  });

  // Orden no encontrada
  it("responde 404 si el pedido no existe", async () => {

    const id = new mongoose.Types.ObjectId().toString();
    const response = await request(app).get(`/api/orders/${id}`);

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('ORDER_NOT_FOUND');
    expect(response.body.message).to.equal('Orden no encontrada');
  });

  // Invalid status
  it("responde 400 si estado asignado es inválido", async () => {

    const id = new mongoose.Types.ObjectId().toString();
    const response = await request(app).put(`/api/orders/${id}/status`).send({ status: 'estado-invalido' });

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('INVALID_ORDER_STATUS');
    expect(response.body.message).to.equal('El estado ingresado no es válido para un pedido');
  });

  // Order not found update status
  it("responde 404 si la orden del estado actualizado no se encuentra", async () => {

    const id = new mongoose.Types.ObjectId().toString();
    const response = await request(app).put(`/api/orders/${id}/status`).send({ status: 'assigned' });

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('ORDER_NOT_FOUND');
    expect(response.body.message).to.equal('Orden no encontrada');
  });

  // ID inválido put
  it("responde 400 si el formato del id ingresado es inválido", async () => {

    const id = 'invalido'
    const response = await request(app).put(`/api/orders/${id}/status`).send({ status: 'assigned' });

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('INVALID_DATA');
    expect(response.body.message).to.equal('El formato de los datos ingresados es incorrecto');
  });

  // Order not found delete
  it("responde 404 si la orden eliminada no se encuentra", async () => {

    const id = new mongoose.Types.ObjectId().toString();
    const response = await request(app).delete(`/api/orders/${id}`);

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('ORDER_NOT_FOUND');
    expect(response.body.message).to.equal('Orden no encontrada');
  });


  //tienda no encontrada
  it("responde 404 si la tienda no existe", async () => {

    const body = await orderFixture();
    body.store = new mongoose.Types.ObjectId().toString();

    const response = await request(app).post('/api/orders').send(body);

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('STORE_NOT_FOUND');
    expect(response.body.message).to.equal('Tienda no encontrada');
  });

  //Customer no encontrado
  it("responde 404 si el usuario no existe", async () => {

    const body = await orderFixture();
    body.customer = new mongoose.Types.ObjectId().toString();

    const response = await request(app).post('/api/orders').send(body);

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('USER_NOT_FOUND');
    expect(response.body.message).to.equal('Usuario no encontrado');
  });

  //Product no encontrado
  it("responde 404 si el producto no existe", async () => {

    const body = await orderFixture();
    body.items[0].product = new mongoose.Types.ObjectId().toString();

    const response = await request(app).post('/api/orders').send(body);

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('PRODUCT_NOT_FOUND');
    expect(response.body.message).to.equal('Producto no encontrado');
  });

  //Stock insuficiente
  it("responde 409 sino hay suficiente stock", async () => {

    const body = await orderFixture();
    body.items[0].quantity = 6;
    const response = await request(app).post('/api/orders').send(body);

    expect(response.status).to.equal(409);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('PRODUCT_NOT_AVAILABLE');
    expect(response.body.message).to.equal('Producto no disponible');
  });

  //formato invalido de id delete o get
  ['get', 'delete'].forEach(method => {
    it('responde 400 si el id tiene un formato invalido', async () => {
      const response = await request(app)[method]('/api/orders/id-invalido');

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal('error');
      expect(response.body.error).to.equal('INVALID_DATA');
      expect(response.body.message).to.equal('El formato de los datos ingresados es incorrecto');
    });
  });

  //Cantidad inválida
  it('debería responder error 400 si la cantidad es inválida', async () => {

    const body = await orderFixture()
    body.items[0].quantity = -5;

    const response = await request(app).post('/api/orders').send(body);

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('INVALID_QUANTITY');
    expect(response.body.message).to.equal('El formato de la cantidad es incorrecto');
  });
});
