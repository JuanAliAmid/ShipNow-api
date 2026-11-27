import ERROR_CODES from '../errors/error.codes.js';
import logger from '../config/logger.js';
import { deliveryRepository } from '../repository/delivery.repository.js';
import { createError } from '../utils/apiResponse.js';
import { DELIVERY_STATUS } from '../constants/constants.js';
import { userRepository } from '../repository/user.repository.js';
import { USER_ROLES } from '../constants/constants.js';
import { orderRepository } from '../repository/order.repository.js';

export const deliveryService = {
    getAll: async (page, limit) => {
        page = Number(page);
        limit = Number(limit);
        page = !Number.isInteger(page) || page <= 0 ? 1 : page;
        limit = !Number.isInteger(limit) || limit <= 0 ? 10 : Math.min(limit, 50);
        const deliveries = await deliveryRepository.findAll(page, limit);
        return deliveries;
    },
    create: async (deliveryData) => {
        const { order, driver } = deliveryData
        if (!order || !driver) {
            throw createError(ERROR_CODES.REQUIRED_FIELDS);
        };

        const driverFound = await userRepository.findById(driver);
        if (!driverFound || driverFound.role !== USER_ROLES.DRIVER) {
            throw createError(ERROR_CODES.DRIVERS_NOT_FOUND);
        };

        const orderFound = await orderRepository.findById(order);
        if (!orderFound) {
            throw createError(ERROR_CODES.ORDER_NOT_FOUND);
        };

        const delivery = await deliveryRepository.create(deliveryData);

        return delivery;
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
    },
    delete: async (id) => {
        const delivery = await deliveryRepository.delete(id);

        if (!delivery) {
            throw createError(ERROR_CODES.DELIVERY_NOT_FOUND);
        };
        return delivery;
    }
};