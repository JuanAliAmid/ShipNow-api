import ProductModel from "../../models/product.model.js";

export async function productFixture() {
    const product = await ProductModel.create({
        name: 'jabon',
        price: 1500,
        quantity: 2,
        status: 'available'
    });

    return product;
};