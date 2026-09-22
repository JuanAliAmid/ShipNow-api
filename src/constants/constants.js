export const USER_ROLES = Object.freeze({
    ADMIN: 'admin',
    USER: 'customer',
    STORE: 'store',
    DRIVER: 'driver'
});

export const ORDER_STATUS = Object.freeze({
    CREATED: 'created',
    PICKED_UP: 'picked_up',
    ASSIGNED: 'assigned',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
});

export const ORDER_PRORITY = Object.freeze({
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high'
});

export const DELIVERY_STATUS = Object.freeze({
    ASSIGNED: 'assigned',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
});
