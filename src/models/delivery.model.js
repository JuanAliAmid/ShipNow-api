import mongoose from 'mongoose';
import { DELIVERY_STATUS, ORDER_PRORITY } from '../constants/constants.js';

const deliverySchema = mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: [DELIVERY_STATUS.ASSIGNED, DELIVERY_STATUS.CANCELLED, DELIVERY_STATUS.DELIVERED, DELIVERY_STATUS.IN_TRANSIT],
            default: DELIVERY_STATUS.ASSIGNED
        },
        priority: {
            type: String,
            enum: [ORDER_PRORITY.NORMAL, ORDER_PRORITY.LOW, ORDER_PRORITY.HIGH],
            default: ORDER_PRORITY.NORMAL
        },
        notes: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model('Delivery', deliverySchema);