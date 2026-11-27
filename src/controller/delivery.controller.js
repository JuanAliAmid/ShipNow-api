import { deliveryService } from "../service/delivery.service.js";
import { successResponse } from "../utils/apiResponse.js";

export const deliveryController = {
    getAll: async (req, res, next) => {
        try {
            const { page, limit } = req.query;
            const deliveries = await deliveryService.getAll(page, limit);
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
    create: async (req, res, next) => {

        try {
            const delivery = await deliveryService.create(req.body);
            successResponse(res, { statusCode: 201, message: 'Delivery creado', payload: delivery });
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
    },
    delete: async (req, res, next) => {
        const { did } = req.params;
        try {
            const delivery = await deliveryService.delete(did);
            successResponse(res, { message: 'Delivery eliminado', payload: delivery });
        } catch (error) {
            next(error);
        };
    }
};