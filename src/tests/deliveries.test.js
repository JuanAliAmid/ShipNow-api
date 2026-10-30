import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';
import { deliveriesFixture } from './helpers/deliveriesFixture.js';
import mongoose from "mongoose";

describe('Deliveries API', () => {

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

    //Delivery no encontrado de update
    it("responde 404 si el delivery a actualizar no existe", async () => {

        const id = new mongoose.Types.ObjectId().toString();
        const response = await request(app).put(`/api/deliveries/${id}/status`).send({ status: 'delivered' });

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('DELIVERY_NOT_FOUND');
        expect(response.body.message).to.equal('Delivery no encontrado');
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