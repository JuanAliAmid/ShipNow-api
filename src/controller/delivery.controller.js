import { deliveryService } from "../service/delivery.service.js";
import { successResponse } from "../utils/apiResponse.js";

export const deliveryController = {
    getAll: async (_req, res, next) => {
        try {
            const deliveries = await deliveryService.getAll();
            successResponse(res, { message: 'Lista de deliveries', payload: deliveries });
        } catch (error) {
            next(error);
        };
    },
    getById: async (req, res, next) => {
        try {
            const delivery = await deliveryService.getById(req.params.did)
            successResponse(res, { message: 'Delivery obtenido por id', payload: delivery });
        } catch (error) {
            next(error);
        };
    },
    updateStatus: async (req, res, next) => {
        try {
            const delivery = await deliveryService.updateStatus(req.params.did, req.body.status)
            successResponse(res, { message: 'Estado actualizado', payload: delivery });
        } catch (error) {
            next(error);
        };
    }
};