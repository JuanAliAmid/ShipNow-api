import { storeService } from "../service/store.service.js";

export const storeController = {
    getStores: async (_req, res, next) => {
        try {
            const stores = await storeService.getStores();
            res.json({ status: 'success', payload: stores });
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {

        try {
            const store = await storeService.create(req.body);
            res.json({ status: 'success', payload: store });
        } catch (error) {
            next(error);
        }

    },

    findById: async (req, res, next) => {
        const { sid } = req.params;
        try {
            const store = await storeService.findById(sid)
            res.json({ status: 'success', payload: store });
        } catch (error) {
            next(error);
        }
    },

    updateStore: async (req, res, next) => {
        const { sid } = req.params;

        try {
            const storeUpdate = await storeService.updateStore(sid, req.body)
            res.json({ status: 'success', payload: storeUpdate });
        } catch (error) {
            next(error);
        }

    },

    delete: async (req, res, next) => {
        const { sid } = req.params;
        try {
            const store = await storeService.delete(sid);
            res.json({ status: 'success', payload: store });
        } catch (error) {
            next(error);
        }
    }

}