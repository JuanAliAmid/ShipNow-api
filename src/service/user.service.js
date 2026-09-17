import { userRepository } from "../repository/user.repository.js";

export const userService = {
    findById: async (id) => {
        const user = await userRepository.findById(id);
        if (!user) {
            const error = new Error('"Usuario no encontrado"');
            error.status = 404;
            throw error
        }
        return user;
    },

    getUsers: async () => {
        return userRepository.getUsers()
    },

    create: async (userData) => {
        const { firstName, lastName, email, password } = userData
        if (!firstName || !lastName || !email || !password) {
            const error = new Error('Faltan datos obligatorios');
            error.statusCode = 400;
            throw error;
        }
        const newUser = await userRepository.create(userData);
        return newUser
    },

    updateUser: async (id, newData) => {
        const userUpdate = await userRepository.updateUser(
            id,
            newData,
            { new: true, runValidators: true },
        );
        if (!userUpdate) {
            const error = new Error('Usuario no encontrado');
            error.status = 404;
            throw error;
        }
        return userUpdate;
    },

    delete: async (id) => {
        const userDelete = await userRepository.delete(id);
        if (!userDelete) {
            const error = new Error('Usuario no encontrado');
            error.status = 404;
            throw error;
        }
        return userDelete;
    }
}