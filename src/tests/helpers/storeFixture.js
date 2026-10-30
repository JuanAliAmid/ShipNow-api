import UserModel from "../../models/user.model.js";
import StoreModel from "../../models/store.model.js";

export async function storeFixture() {

    const numeroAleatorio = Math.floor(Math.random() * (99 - 10 + 1)) + 10;

    const owner = await UserModel.create({
        firstName: "Leonela",
        lastName: "test",
        email: `owner${numeroAleatorio}@test.com`,
        password: "testing",
        role: "store"
    });

    const store = await StoreModel.create({
        name: 'Store test',
        address: 'Avenida test',
        owner: owner._id,
        isActive: true
    });
    return store;
};