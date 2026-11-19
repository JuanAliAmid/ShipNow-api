import deliveryModel from "../models/delivery.model.js";

export const deliveryRepository = {
    findAll: async (page, limit) => {
        const skip = (page - 1) * limit;
        return deliveryModel.find().skip(skip).limit(limit);
    },

    findById: async (id) => {
        return deliveryModel.findById(id);
    },

    create: async (deliveryData) => {
        return deliveryModel.create(deliveryData);
    },

    updateStatus: async (id, status) => {
        return deliveryModel.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true },
        );
    },
    delete: async (id) => {
        return deliveryModel.findByIdAndDelete(id)
    },
    createMany: async (deliveryData) => {
        return deliveryModel.insertMany(deliveryData);
    }
};