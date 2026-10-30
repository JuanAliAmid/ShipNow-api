import UserModel from "../../models/user.model.js";
import StoreModel from "../../models/store.model.js";
import ProductModel from "../../models/product.model.js";

export async function orderFixture() {

    const customer = await UserModel.create({
        firstName: "Belinda",
        lastName: "test",
        email: "belinda@test.com",
        password: "testing",
        role: "customer"
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

    const product = await ProductModel.create({
        name: 'Motorola',
        quantity: 3,
        price: 2000,
        status: "available"
    });


    return {
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
    };
};