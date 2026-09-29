import { storeService } from "../service/store.service.js";
import { successResponse } from "../utils/apiResponse.js";

export const storeController = {
    getStores: async (_req, res, next) => {
        try {
            const stores = await storeService.getStores();
            successResponse(res, { message: 'Lista de tiendas', payload: stores });
        } catch (error) {
            next(error);
        };
    },

    create: async (req, res, next) => {

        try {
            const store = await storeService.create(req.body);
            successResponse(res, { statusCode: 201, message: 'Tienda creada', payload: store });
        } catch (error) {
            next(error);
        };
    },

    findById: async (req, res, next) => {
        const { sid } = req.params;
        try {
            const store = await storeService.findById(sid)
            successResponse(res, { message: 'Tienda encontrada por id', payload: store });
        } catch (error) {
            next(error);
        };
    },

    updateStore: async (req, res, next) => {
        const { sid } = req.params;
        try {
            const storeUpdate = await storeService.updateStore(sid, req.body)
            successResponse(res, { message: 'Tienda actualizada', payload: storeUpdate });
        } catch (error) {
            next(error);
        };
    },

    delete: async (req, res, next) => {
        const { sid } = req.params;
        try {
            const store = await storeService.delete(sid);
            successResponse(res, { message: 'Tienda eliminada', payload: store });
        } catch (error) {
            next(error);
        };
    }

}