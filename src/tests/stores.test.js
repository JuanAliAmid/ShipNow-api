import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';
import StoreModel from '../models/store.model.js';
import UserModel from '../models/user.model.js';
import mongoose from 'mongoose';
import { storeFixture } from './helpers/storeFixture.js';

describe('Stores API', () => {
    //created
    describe('Create store ', () => {
        it('crea y persiste una tienda valida', async () => {
            const owner = await UserModel.create({
                firstName: "Leonela",
                lastName: "test",
                email: "owner@test.com",
                password: "testing",
                role: "store"
            });

            const newStore = {
                name: 'Store falsa',
                address: 'Avenida test 15',
                owner: owner._id.toString()
            };

            const response = await request(app).post('/api/stores').send(newStore);

            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload._id).to.be.a('string');
            expect(response.body.payload.name).to.equal(newStore.name);
            expect(response.body.payload.address).to.equal(newStore.address);
            expect(response.body.payload.owner).to.equal(newStore.owner);
            expect(response.body.payload.isActive).to.equal(true);

            const saved = await StoreModel.findById(response.body.payload._id.toString());
            expect(saved).to.not.be.null;
        });
    });

    //Get all
    describe('Store list', () => {
        it('debería responder con una lista de tiendas', async () => {

            const store = await storeFixture();
            const response = await request(app).get('/api/stores/');

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.lengthOf(1);
            expect(response.body.payload[0]._id).to.equal(store._id.toString());
        });
    });

    // Get by id
    describe('Get store by id', () => {
        it('debería responder con una tienda obtenida por id', async () => {

            const body = await storeFixture();
            const getResponse = await request(app).get(`/api/stores/${body._id.toString()}`);

            expect(getResponse.status).to.equal(200);
            expect(getResponse.body).to.have.property('status');
            expect(getResponse.body.status).to.equal('success');
            expect(getResponse.body).to.have.property('payload');
            expect(getResponse.body.payload._id).to.equal(body._id.toString());
            expect(getResponse.body.payload).to.be.an('object');
        });
    });

    // Update by id
    describe('Update store by id', () => {
        it('debería responder con una tienda actualizada por id', async () => {

            const body = await storeFixture();

            const newName = 'Store toy test';
            const newAddress = 'Avenida test segundo';
            const newOwner = new mongoose.Types.ObjectId().toString();

            const putResponse = await request(app).put(`/api/stores/${body._id.toString()}`).send({ name: newName, address: newAddress, owner: newOwner });

            expect(putResponse.status).to.equal(200);
            expect(putResponse.body).to.have.property('status');
            expect(putResponse.body.status).to.equal('success');
            expect(putResponse.body).to.have.property('payload');
            expect(putResponse.body.payload._id).to.equal(body._id.toString());
            expect(putResponse.body.payload.name).to.equal(newName);
            expect(putResponse.body.payload.address).to.equal(newAddress);
            expect(putResponse.body.payload.owner).to.equal(newOwner);
            expect(putResponse.body.payload).to.be.an('object');
        });
    });

    // Delete by id
    describe('Delete store by id', () => {
        it('debería responder con una tienda eliminada por id', async () => {

            const body = await storeFixture();

            const deleteResponse = await request(app).delete(`/api/stores/${body._id.toString()}`);

            expect(deleteResponse.status).to.equal(200);
            expect(deleteResponse.body.status).to.equal('success');

            const getResponse = await request(app).get(`/api/stores/${body._id.toString()}`);

            expect(getResponse.status).to.equal(404);
            expect(getResponse.body.status).to.equal('error');
            expect(getResponse.body.error).to.equal('STORE_NOT_FOUND');
        });
    });
});

describe('Stores API errors', () => {

    //400 Por falta de datos
    ['name', 'address', 'owner'].forEach(camp => {
        it(`Debería responder con error 400 si falta ${camp}`, async () => {

            const body = {
                name: 'Store test',
                address: 'Avenida test 15',
                owner: new mongoose.Types.ObjectId().toString()
            };

            delete body[camp];

            const response = await request(app).post('/api/stores').send(body);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('REQUIRED_FIELDS');
            expect(response.body.message).to.equal('Faltan datos obligatorios');
        });
    });
    //400 por id con formato inválido y 404 por tienda no encontrada
    ['get', 'put', 'delete'].forEach(method => {
        it(`responde 400 si el id de la tienda tiene un formato invalido (${method.toUpperCase()})`, async () => {
            const response = await request(app)[method]('/api/stores/id-invalido').send({ name: 'Nuevo' });

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('INVALID_DATA');
            expect(response.body.message).to.equal('El formato de los datos ingresados es incorrecto');
        });

        it(`responde 404 si la tienda no existe (${method.toUpperCase()})`, async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const response = await request(app)[method](`/api/stores/${id}`).send({ name: 'Nuevo' });

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('STORE_NOT_FOUND');
            expect(response.body.message).to.equal('Tienda no encontrada');
        });
    });
});