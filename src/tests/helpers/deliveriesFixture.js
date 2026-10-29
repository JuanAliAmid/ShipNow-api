import DeliveryModel from "../../models/delivery.model.js";
import UserModel from "../../models/user.model.js";
import OrderModel from "../../models/order.model.js";
import ProductModel from "../../models/product.model.js";
import StoreModel from "../../models/store.model.js";


export async function deliveriesFixture() {

    const customer = await UserModel.create({
        firstName: "Belinda",
        lastName: "test",
        email: "belinda@test.com",
        password: "testing",
        role: "customer"
    });

    const product = await ProductModel.create({
        name: 'Motorola',
        quantity: 3,
        price: 2000,
        status: "available"
    });

    const driver = await UserModel.create({
        firstName: "Usuario1",
        lastName: "Demo1",
        email: "user1@test.com",
        password: "coder123",
        role: "driver"
    });

    const owner = await UserModel.create({
        firstName: "Leonela",
        lastName: "test",
        email: "owner@test.com",
        password: "testing",
        role: "store"
    });

    const store = await StoreModel.create({
        name: "Store Testing",
        address: "Calle asta 123",
        owner: owner._id,
    });

    const order = await OrderModel.create({
        customer: customer._id.toString(),
        store: store._id.toString(),
        deliveryAddress: "Av. seguido 12",
        items: [{
            product: product._id.toString(),
            name: product.name,
            quantity: 3,
            price: product.price,
        }],
        total: product.price * 3

    });

    const delivery = await DeliveryModel.create({
        order: order._id,
        driver: driver._id,
        status: 'assigned',
        priority: 'normal'
    });
    return delivery;
};

