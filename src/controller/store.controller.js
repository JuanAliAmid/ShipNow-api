import { storeService } from "../service/store.service.js";

export const storeController = {
    getStores: async (_req, res) => {
        try {
            const stores = await storeService.getStores();
            res.json({ status: 'success', payload: stores });
        } catch (error) {
            res.status(error.statusCode).json({ status: 'error', message: error.message });
        }
    },

    create: async (req, res,) => {

        try {
            const store = await storeService.create(req.body);
            res.json({ status: 'success', payload: store });
        } catch (error) {
            res.status(error.statusCode).json({ status: 'error', message: error.message });
        }

    },

    findById: async (req, res) => {
        const { sid } = req.params;
        try {
            const store = await storeService.findById(sid)
            res.json({ status: 'success', payload: store });
        } catch (error) {
            res.status(error.statusCode).json({ status: 'error', message: error.message });
        }
    },

    updateStore: async (req, res) => {
        const { sid } = req.params;

        try {
            const storeUpdate = await storeService.updateStore(sid, req.body)
            res.json({ status: 'success', payload: storeUpdate });
        } catch (error) {
            res.status(error.statusCode).json({ status: 'error', message: error.message });
        }

    },

    delete: async (req, res) => {
        const { sid } = req.params;
        try {
            const store = await storeService.delete(sid);
            res.json({ status: 'success', payload: store });
        } catch (error) {
            res.status(error.statusCode).json({ status: 'error', message: error.message });
        }
    }

}