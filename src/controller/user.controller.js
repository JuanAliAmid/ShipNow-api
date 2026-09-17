import { userService } from "../service/user.service.js";

export const userController = {
    findById: async (req, res) => {
        const { uid } = req.params;
        try {
            const user = await userService.findById(uid);
            res.json({ status: 'success', payload: user })
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    getUsers: async (_req, res) => {
        try {
            const users = await userService.getUsers()
            res.json({ status: 'success', payload: users })
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const newUser = await userService.create(req.body);
            res.json({ status: 'success', payload: newUser });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            const userUpdate = await userService.updateUser(
                req.params.uid,
                req.body,
            );
            if (!userUpdate) {
                const error = new Error('Usuario no encontrado');
                error.status = 404;
                throw error;
            }
            res.json({ status: 'success', payload: userUpdate })
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const userDelete = await userService.delete(req.params.uid);
            if (!userDelete) {
                const error = new Error('Usuario no encontrado');
                error.status = 404;
                throw error;
            }
            res.json({ status: 'success', payload: userDelete })
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }

    }
}