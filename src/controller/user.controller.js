import { userService } from "../service/user.service.js";
import {successResponse} from '../utils/apiResponse.js'

export const userController = {
    findById: async (req, res, next) => {
        const { uid } = req.params;
        try {
            const user = await userService.findById(uid);
            successResponse(res, { message: 'Usuario encontrado por id', payload: user });
        } catch (error) {
            next(error);
        };
    },

    getUsers: async (_req, res, next) => {
        try {
            const users = await userService.getUsers()
            successResponse(res, { message: 'Lista de usuarios', payload: users });
        } catch (error) {
            next(error);
        };
    },

    create: async (req, res, next) => {
        try {
            const newUser = await userService.create(req.body);
            successResponse(res, { statusCode: 201, message: 'Usuario creado', payload: newUser });
        } catch (error) {
            next(error);
        };
    },

    updateUser: async (req, res, next) => {
        try {
            const userUpdate = await userService.updateUser(req.params.uid, req.body,);
            successResponse(res, { message: 'Usuario actualizado', payload: userUpdate });
        } catch (error) {
            next(error);
        };
    },

    delete: async (req, res, next) => {
        try {
            const userDelete = await userService.delete(req.params.uid);
            successResponse(res, { message: 'Usuario eliminado', payload: userDelete });
        } catch (error) {
            next(error);
        };
    }
};