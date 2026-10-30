import { env } from "../config/index.js";
import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
import OrderModel from "../models/order.model.js";
import StoreModel from "../models/store.model.js";
import DeliveryModel from "../models/delivery.model.js";
import ProductModel from "../models/product.model.js";

function testDataBase() {
    if (env.nodeEnv !== 'test' || mongoose.connection.name !== 'ShipNow-api-test') {
        throw new Error('No se pudo conectar a la base de datos');
    };
};

async function clean() {
    testDataBase();

    await UserModel.deleteMany({});
    await DeliveryModel.deleteMany({});
    await StoreModel.deleteMany({});
    await OrderModel.deleteMany({});
    await ProductModel.deleteMany({});
};

export const mochaHooks = {
    async beforeAll() {
        if (!env.mongodb_uri) {
            throw new Error('Falta MONGODB_URI_TEST en .env');
        };

        await mongoose.connect(env.mongodb_uri);

        testDataBase();
    },

    async beforeEach() {
        await clean();
    },

    async afterAll() {
        await mongoose.disconnect();
    }
};