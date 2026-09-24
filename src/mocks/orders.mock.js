import { ORDER_PRORITY, ORDER_STATUS } from "../constants/constants.js";

const generateMockOrder = (userId,storeId, productId, index) => {
    const items = [
        {
            name: `Paquete${index}`,
            quantity: 1,
            price: 2000,
            product: productId
        }
    ];

    const total = items.reduce((a, b) => a + b.quantity * b.price, 0);

    return {
        customer: userId,
        items,
        store: storeId,
        deliveryAddress: `Av. Brasil ${200 + index}`,
        total,
        status: ORDER_STATUS.CREATED,
        priority: ORDER_PRORITY.NORMAL
    };
};

const generateMockOrders = (userIds, storeIds, productIds, quantity) => {
    const orders = [];
    for (let i = 0; i < quantity; i++) {
        const userId = userIds[i % userIds.length];
        const storeId = storeIds[i % storeIds.length];
        const productId = productIds[i % productIds.length];
        orders.push(generateMockOrder(userId, storeId, productId, i + 1));
    };
    return orders;
}

export default {
    generateMockOrder,
    generateMockOrders
}