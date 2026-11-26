import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import { productFixture } from "./helpers/productFixture.js";
import mongoose from 'mongoose';
import ProductModel from '../src/models/product.model.js';

describe('Products API', () => {
    //Create
    describe('Create product', () => {
        it('debería responder con un nuevo producto creado', async () => {
            const newProduct = {
                name: 'jabonTest',
                price: 2000,
                quantity: 3,
            };

            const response = await request(app).post('/api/products').send(newProduct);

            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload._id).to.be.a('string');
            expect(response.body.payload.name).to.equal(newProduct.name);
            expect(response.body.payload.price).to.equal(newProduct.price);
            expect(response.body.payload.quantity).to.equal(newProduct.quantity);
            expect(response.body.payload.status).to.equal('available');
        });
    });

    //Get all
    describe('Products list', () => {
        it('deberia responder con una lista de productos', async () => {
            const product = await productFixture();
            const response = (await request(app).get('/api/products/'));

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.lengthOf(1);
            expect(response.body.payload[0]._id).to.equal(product._id.toString());
        });
    });

    //Get by id
    describe('Get product by id', () => {
        it('deberia responder con un producto obtenido por id', async () => {
            const product = await productFixture();
            const response = await request(app).get(`/api/products/${product._id.toString()}`);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body).to.have.property('payload')
            expect(response.body.payload._id).to.equal(product._id.toString());
            expect(response.body.payload).to.be.an('object');
        });
    });

    // Update by id
    describe('Update product by id', () => {
        it('debería responder con un producto actualizado por id', async () => {

            const body = await productFixture();

            const newName = 'Product update';
            const newprice = 1500;
            const newQuantity = 6;
            const newStatus = 'out of stock';

            const putResponse = await request(app).put(`/api/products/${body._id.toString()}`).send({ name: newName, quantity: newQuantity, price: newprice, status: newStatus });

            expect(putResponse.status).to.equal(200);
            expect(putResponse.body).to.have.property('status');
            expect(putResponse.body.status).to.equal('success');
            expect(putResponse.body).to.have.property('payload');
            expect(putResponse.body.payload._id).to.equal(body._id.toString());
            expect(putResponse.body.payload.name).to.equal(newName);
            expect(putResponse.body.payload.price).to.equal(newprice);
            expect(putResponse.body.payload.quantity).to.equal(newQuantity);
            expect(putResponse.body.payload.status).to.equal(newStatus);
            expect(putResponse.body.payload).to.be.an('object');
        });
    });

    // Delete by id
    describe('Delete product by id', () => {
        it('debería responder con un producto eliminado por id', async () => {

            const body = await productFixture();

            const deleteResponse = await request(app).delete(`/api/products/${body._id.toString()}`);

            expect(deleteResponse.status).to.equal(200);
            expect(deleteResponse.body.status).to.equal('success');

            const getResponse = await request(app).get(`/api/products/${body._id.toString()}`);

            expect(getResponse.status).to.equal(404);
            expect(getResponse.body.status).to.equal('error');
            expect(getResponse.body.error).to.equal('PRODUCT_NOT_FOUND');
        });
    });
});

describe('Products pagination', () => {
    beforeEach(async () => {
        const products = Array.from({ length: 60 }, (_, i) => ({
            name: `producto${i}`,
            price: 1000,
            quantity: 1,
            status: 'available'
        }));
        await ProductModel.insertMany(products);
    });

    it('usa limit 10 por defecto', async () => {
        const response = await request(app).get('/api/products');

        expect(response.status).to.equal(200);
        expect(response.body.payload).to.have.lengthOf(10);
    });

    it('respeta un limit válido', async () => {
        const response = await request(app).get('/api/products?limit=5');

        expect(response.body.payload).to.have.lengthOf(5);
    });

    it('la página 2 con limit 50 devuelve el resto', async () => {
        const response = await request(app).get('/api/products?page=2&limit=50');

        expect(response.body.payload).to.have.lengthOf(10);
    });

    it('si limit supera 50, devuelve 50', async () => {
        const response = await request(app).get('/api/products?limit=100');

        expect(response.body.payload).to.have.lengthOf(50);
    });
});

describe('Products API errors', () => {

    ['name', 'price', 'quantity'].forEach(camp => {
        it(`Debería responder con error 400 si falta ${camp}`, async () => {

            const body = {
                name: 'arroz test',
                price: 1000,
                quantity: 5
            };

            delete body[camp];

            const response = await request(app).post('/api/products').send(body);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('REQUIRED_FIELDS');
            expect(response.body.message).to.equal('Faltan datos obligatorios');
        });
    });

    it(`Debería responder con error 400 price tiene un valor inválido`, async () => {

        const body = {
            name: 'arroz test',
            price: 0,
            quantity: 5
        };

        const response = await request(app).post('/api/products').send(body);

        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('INVALID_DATA');
        expect(response.body.message).to.equal('El formato de los datos ingresados es incorrecto');
    });

    it('debería devolver 404 por un producto no encontrado', async () => {
        const id = new mongoose.Types.ObjectId().toString();

        const response = await request(app).get(`/api/products/${id}`);

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('PRODUCT_NOT_FOUND');
        expect(response.body.message).to.equal('Producto no encontrado');
    });
});

