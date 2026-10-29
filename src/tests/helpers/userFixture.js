import UserModel from "../../models/user.model.js";

export async function userFixture() {
    const user = await UserModel.create({
        firstName: "Usuario1",
        lastName: "Demo1",
        email: "user1@test.com",
        password: "coder123",
        role: "customer"
    });
    return user;
};