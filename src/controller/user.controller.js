import { userService } from "../service/user.service.js";

export const userController = {
    findById: async (req, res, next) => {
        const { uid } = req.params;
        try {
            const user = await userService.findById(uid);
            res.json({ status: 'success', payload: user })
        } catch (error) {
            next(error);
        }
    },

    getUsers: async (_req, res, next) => {
        try {
            const users = await userService.getUsers()
            res.json({ status: 'success', payload: users })
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const newUser = await userService.create(req.body);
            res.json({ status: 'success', payload: newUser });
        } catch (error) {
            next(error);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const userUpdate = await userService.updateUser(req.params.uid, req.body,);

            res.json({ status: 'success', payload: userUpdate })
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const userDelete = await userService.delete(req.params.uid);

            res.json({ status: 'success', payload: userDelete })
        } catch (error) {
            next(error);
        }

    }
}