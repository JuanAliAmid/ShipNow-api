import { DELIVERY_STATUS, ORDER_PRORITY } from "../constants/constants.js";

const generateMockDelivery = (orderId, driverId, index) => {
    return {
        order: orderId,
        diver: driverId,
        status: DELIVERY_STATUS.ASSIGNED,
        priority: ORDER_PRORITY.NORMAL,
        notes: `Entrega de prueba ${index}`
    };
};