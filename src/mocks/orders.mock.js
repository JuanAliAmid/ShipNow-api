import mongoose from "mongoose";
import { ORDER_PRORITY, ORDER_STATUS } from "../constants/constants.js";

const generateMockOrder = (userId, index) => {
    const items = [
        {
            name: `Paquete${index}`,
            quantity: 1,
            price: 2000
        }
    ];

    const total = items.reduce((a, b) => a + b.quantity * b.price, 0);

    return {
        customer: userId,
        items,
        store: new mongoose.Types.ObjectId(),
        deliveryAddress: `Av. Brasil ${200 + index}`,
        total,
        status: ORDER_STATUS.CREATED,
        priority: ORDER_PRORITY.NORMAL
    };
};

const generateMockOrders = (userIds, quantity) => {
    const orders = [];
    for (let i = 0; i < quantity; i++) {
        const userId = userIds[i % userIds.length];
        orders.push(generateMockOrder(userId, i + 1));
    };
    return orders;
}

export default {
    generateMockOrder,
    generateMockOrders
}