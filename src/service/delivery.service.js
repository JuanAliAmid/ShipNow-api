import ERROR_CODES from '../errors/error.codes.js';
import logger from '../config/logger.js';
import { deliveryRepository } from '../repository/delivery.repository.js';
import { createError } from '../utils/apiResponse.js';
import { DELIVERY_STATUS } from '../constants/constants.js';

export const deliveryService = {
    getAll: async () => {
        const deliveries = await deliveryRepository.findAll();
        return deliveries;
    },
    getById: async (id) => {
        const delivery = await deliveryRepository.findById(id);

        if (!delivery) {
            throw createError(ERROR_CODES.DELIVERY_NOT_FOUND);
        };
        return delivery;
    },
    updateStatus: async (id, newStatus) => {

        if (!Object.values(DELIVERY_STATUS).includes(newStatus)) {
            throw createError(ERROR_CODES.INVALID_DELIVERY_STATUS);
        };

        const delivery = await deliveryRepository.updateStatus(id, newStatus);

        if (!delivery) {
            logger.warning(`Delivery con id: ${id} no encontrado`);
            throw createError(ERROR_CODES.DELIVERY_NOT_FOUND);
        };
        return delivery;
    }
};