import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import { deliveriesFixture } from './helpers/deliveriesFixture.js';
import mongoose from "mongoose";
import deliveryModel from '../src/models/delivery.model.js';
import { USER_ROLES } from '../src/constants/constants.js';
import UserModel from '../src/models/user.model.js';

describe('Deliveries API', () => {

    describe('Create delivery', () => {
        it('crea y persiste un delivery', async () => {

            const body = await deliveriesFixture();

            const newDelivery = {
                order: body.order.toString(),
                driver: body.driver.toString(),
                notes: 'Dejar en puerta'
            };

            const response = await request(app).post('/api/deliveries/').send(newDelivery);

            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.property('_id');
            expect(response.body.payload.driver).to.equal(body.driver.toString());
            expect(response.body.payload.order).to.equal(body.order.toString());
            expect(response.body.payload.status).to.equal('assigned');
        });
    });

    //Get all
    describe('Delivery list', () => {
        it('debería responder con una lista de deliveries', async () => {
            const delivery = await deliveriesFixture();
            const response = await request(app).get('/api/deliveries');

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.lengthOf(1);
            expect(response.body.payload[0]._id).to.equal(delivery._id.toString());
            expect(response.body.payload[0].status).to.equal('assigned');
        });
    });

    // Get by id
    describe('Get delivery by id', () => {
        it('debería responder con un delivery obtenido por id', async () => {

            const body = await deliveriesFixture();
            const getResponse = await request(app).get(`/api/deliveries/${body._id.toString()}`);

            expect(getResponse.status).to.equal(200);
            expect(getResponse.body).to.have.property('status');
            expect(getResponse.body.status).to.equal('success');
            expect(getResponse.body).to.have.property('payload');
            expect(getResponse.body.payload._id).to.equal(body._id.toString());
            expect(getResponse.body.payload).to.be.an('object');
        });
    });

    // Update by id
    describe('Update delivery by id', () => {
        it('debería responder con un delivery con su estado actualizado por id', async () => {

            const body = await deliveriesFixture();
            const newStatus = 'delivered';
            const putResponse = await request(app).put(`/api/deliveries/${body._id.toString()}/status`).send({ status: newStatus });

            expect(putResponse.status).to.equal(200);
            expect(putResponse.body).to.have.property('status');
            expect(putResponse.body.status).to.equal('success');
            expect(putResponse.body).to.have.property('payload');
            expect(putResponse.body.payload._id).to.equal(body._id.toString());
            expect(putResponse.body.payload.status).to.not.equal(body.status);
            expect(putResponse.body.payload.status).to.equal(newStatus);
            expect(putResponse.body.payload).to.be.an('object');
        });
    });

    //Delete by id
    describe('Delete driver by id', () => {
        it('debería responder con un driver eliminado por id', async () => {

            const body = await deliveriesFixture();
            const response = await request(app).delete(`/api/deliveries/${body._id.toString()}`).send(body);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');

            const getResponse = await request(app).get(`/api/deliveries/${body._id.toString()}`);

            expect(getResponse.status).to.equal(404);
            expect(getResponse.body.status).to.equal('error');
            expect(getResponse.body.error).to.equal('DELIVERY_NOT_FOUND');
        });

        it('deberia de responder 404 por delivery no encontrado', async () => {
            const response = await request(app).delete(`/api/deliveries/${new mongoose.Types.ObjectId().toString()}`);

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('DELIVERY_NOT_FOUND');
        })
    });
});

describe('Delivery pagination', () => {
    beforeEach(async () => {
        const deliveries = Array.from({ length: 60 }, (_, i) => ({
            order: new mongoose.Types.ObjectId(),
            driver: new mongoose.Types.ObjectId(),
        }));
        await deliveryModel.insertMany(deliveries);
    });

    it('usa limit 10 por defecto', async () => {
        const response = await request(app).get('/api/deliveries');

        expect(response.status).to.equal(200);
        expect(response.body.payload).to.have.lengthOf(10);
    });

    it('respeta un limit válido', async () => {
        const response = await request(app).get('/api/deliveries?limit=5');

        expect(response.body.payload).to.have.lengthOf(5);
    });

    it('la página 2 con limit 50 devuelve el resto', async () => {
        const response = await request(app).get('/api/deliveries?page=2&limit=50');

        expect(response.body.payload).to.have.lengthOf(10);
    });

    it('si limit supera 50, devuelve 50', async () => {
        const response = await request(app).get('/api/deliveries?limit=100');

        expect(response.body.payload).to.have.lengthOf(50);
    });
});

describe('Deliveries API errors', () => {

    //Delivery no encontrado
    it("responde 404 si el delivery no existe", async () => {

        const id = new mongoose.Types.ObjectId().toString();


        const response = await request(app).get(`/api/deliveries/${id}`);

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('DELIVERY_NOT_FOUND');
        expect(response.body.message).to.equal('Delivery no encontrado');
    });

    //Orden no encontrada
    it("responde 404 si la orden no existe", async () => {

        const body = await deliveriesFixture();

        const response = await request(app).post('/api/deliveries').send({
            order: new mongoose.Types.ObjectId().toString(),
            driver: body.driver.toString()
        });

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('ORDER_NOT_FOUND');
        expect(response.body.message).to.equal('Orden no encontrada');
    });

    //Campos faltantes
    it("responde 400 si faltan campos requeridos", async () => {

        const response = await request(app).post('/api/deliveries').send();

        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('REQUIRED_FIELDS');
        expect(response.body.message).to.equal('Faltan datos obligatorios');
    });

    //Driver no encontrado
    it("responde 404 si el driver no existe", async () => {

        const body = await deliveriesFixture();

        const response = await request(app).post('/api/deliveries').send({
            order: body.order.toString(),
            driver: new mongoose.Types.ObjectId().toString()
        });

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('DRIVERS_NOT_FOUND');
        expect(response.body.message).to.equal('Drivers no encontrados');
    });

    //Delivery no encontrado de update
    it("responde 404 si el delivery a actualizar no existe", async () => {

        const id = new mongoose.Types.ObjectId().toString();
        const response = await request(app).put(`/api/deliveries/${id}/status`).send({ status: 'delivered' });

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('DELIVERY_NOT_FOUND');
        expect(response.body.message).to.equal('Delivery no encontrado');
    });

    //Driver con otro rol
    it('responde 404 si tiene un rol que no sea driver', async () => {
        const body = await deliveriesFixture()
        const driver = await UserModel.create({
            firstName: "Usuario1",
            lastName: "Demo1",
            email: "user3@test.com",
            password: "coder123",
            role: USER_ROLES.USER
        });

        const response = await request(app).post(`/api/deliveries`).send({
            order: body.order.toString(),
            driver: driver._id.toString()
        });

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('DRIVERS_NOT_FOUND');
        expect(response.body.message).to.equal('Drivers no encontrados');
    });


    //El valor del actualizacion de estado es incorrecto
    it('responde 400 si el estado actualizado contiene un valor incorrecto', async () => {

        const id = new mongoose.Types.ObjectId().toString();
        const response = await request(app).put(`/api/deliveries/${id}/status`).send({ status: 'estado-invalido' });

        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('INVALID_DELIVERY_STATUS');
        expect(response.body.message).to.equal('El estado ingresado no es válido para una entrega');
    });
});