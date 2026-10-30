import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';
import { userFixture } from './helpers/userFixture.js';
import mongoose from 'mongoose';
import UserModel from '../models/user.model.js';

describe('Users API', () => {
    //Created
    describe('Create user', () => {
        it('crea y persiste un usuario valido', async () => {

            const newUser = {
                firstName: "Nuevo",
                lastName: "Test",
                email: "nuevo@test.com",
                password: "coder123"
            };

            const response = await request(app).post('/api/users/').send(newUser);

            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload._id).to.be.a('string');
        });
    });

    //Get all
    describe('Users list', () => {
        it('deberia responder con una lista de usuarios', async () => {

            const user = await userFixture()
            const response = await request(app).get('/api/users');

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.lengthOf(1);
            expect(response.body.payload[0]._id).to.equal(user._id.toString());
            expect(response.body.payload[0]).to.not.have.property('password');
        });
    });

    //Get by id
    describe('Get user by id', () => {
        it('deberia responder con un usuario obtenido por id', async () => {

            const body = await userFixture();
            const getResponse = await request(app).get(`/api/users/${body._id.toString()}`);

            expect(getResponse.status).to.equal(200);
            expect(getResponse.body).to.have.property('status');
            expect(getResponse.body.status).to.equal('success');
            expect(getResponse.body).to.have.property('payload');
            expect(getResponse.body.payload._id).to.equal(body._id.toString());
            expect(getResponse.body).to.be.an('object');
        });
    });

    //Update by id
    describe('Update user by id', () => {
        it('deberia responder con un usuario actualizado por id', async () => {

            const body = await userFixture();
            const newFirstName = 'Maria';
            const newLastName = 'Del carmen';
            const newEmail = 'delcarmentest@email.com';
            const newPassword = 'test555';

            const putResponse = await request(app).put(`/api/users/${body._id.toString()}`).send({
                firstName: newFirstName,
                lastName: newLastName,
                email: newEmail,
                password: newPassword
            });

            expect(putResponse.status).to.equal(200);
            expect(putResponse.body).to.have.property('status');
            expect(putResponse.body.status).to.equal('success');
            expect(putResponse.body.payload._id).to.equal(body._id.toString());
            expect(putResponse.body.payload.firstName).to.equal(newFirstName);
            expect(putResponse.body.payload.lastName).to.equal(newLastName);
            expect(putResponse.body.payload.email).to.equal(newEmail);
            expect(putResponse.body.payload).to.not.have.property('password');
            expect(putResponse.body.payload).to.be.an('object');
        });
    });

    //Delete by id
    describe('Delete user by id', () => {
        it('debería responder con un user eliminado por id', async () => {
            const body = await userFixture();
            const response = await request(app).delete(`/api/users/${body._id.toString()}`);

            expect(response.status).to.equal(200)
            expect(response.body.status).to.equal('success');

            const getResponse = await request(app).get(`/api/users/${body._id.toString()}`);

            expect(getResponse.status).to.equal(404);
            expect(getResponse.body.status).to.equal('error');
            expect(getResponse.body.error).to.equal('USER_NOT_FOUND');
        })
    })
});


describe('Users API errors', () => {
    // Faltante de alguno de los 4 campos obligatorios
    ['firstName', 'lastName', 'email', 'password'].forEach(camp => {
        it(`debería responder error 400 si falta ${camp}`, async () => {

            const body = { firstName: "Nuevo", lastName: "Test", email: "nuevo@test.com", password: "coder123" };
            delete body[camp];
            const response = await request(app).post('/api/users').send(body);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('REQUIRED_FIELDS');
            expect(response.body.message).to.equal('Faltan datos obligatorios');
        });
    });

    //Usuario no encontrado
    it("responde 404 si el usuario no existe", async () => {

        const id = new mongoose.Types.ObjectId().toString();

        const response = await request(app).get(`/api/users/${id}`);

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('USER_NOT_FOUND');
        expect(response.body.message).to.equal('Usuario no encontrado');
    });

    // User not found update user
    it("responde 404 si el usuario actualizado no se encuentra", async () => {

        const id = new mongoose.Types.ObjectId().toString();
        const response = await request(app).put(`/api/users/${id}`).send({ firstName: "Nuevo", lastName: "Nombre", email: "nuevo@test.com", password: "nuevo123" });

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('USER_NOT_FOUND');
        expect(response.body.message).to.equal('Usuario no encontrado');
    });

    // User not found delete user
    it("responde 404 si el usuario a eliminar no se encuentra", async () => {

        const id = new mongoose.Types.ObjectId().toString();
        const response = await request(app).delete(`/api/users/${id}`);

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('USER_NOT_FOUND');
        expect(response.body.message).to.equal('Usuario no encontrado');
    });

    //Email ya registrado post
    it('responde 409 si el email ya está registrado', async () => {
        const exist = await userFixture();

        const response = await request(app).post('/api/users').send({
            firstName: "Otro",
            lastName: "Test",
            email: exist.email,
            password: "coder123"
        });

        expect(response.status).to.equal(409);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('DUPLICATE_EMAIL_ADDRESS');
        expect(response.body.message).to.equal('El email ingresado ya se encuentra registrado');
    });

    //Email ya registrado put
    it('responde 409 si el email ya está registrado', async () => {
        const user = await userFixture();
        await UserModel.create({
            firstName: "Otro",
            lastName: "Test",
            email: 'otro@test.com',
            password: "coder123"
        });
        const response = await request(app).put(`/api/users/${user._id.toString()}`).send({ email: 'otro@test.com' });

        expect(response.status).to.equal(409);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('DUPLICATE_EMAIL_ADDRESS');
        expect(response.body.message).to.equal('El email ingresado ya se encuentra registrado');
    });

    //formado invalido de id
    ['get', 'put', 'delete'].forEach(method => {
        it('responde 400 si el id tiene un formato invalido', async () => {
            const response = await request(app)[method]('/api/users/id-invalido').send({ firstName: 'Nuevo' });

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('INVALID_DATA');
            expect(response.body.message).to.equal('El formato de los datos ingresados es incorrecto');
        });
    });
});
