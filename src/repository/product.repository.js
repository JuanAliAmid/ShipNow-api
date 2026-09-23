import { PRODUCT_STATUS } from "../constants/constants.js";
import productModel from "../models/product.model.js";

export const productRepository = {
    findAll: async () => {
        return productModel.find({ status: PRODUCT_STATUS.AVAILABLE });
    },

    findById: async (id) => {
        return productModel.findById(id);
    },

    create: async (productData) => {
        return productModel.create(productData);
    },

    updateStatus: async (id, status) => {
        return productModel.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true },
        );
    },

    updateQuantity: async (id, quantity) => {
        return productModel.findByIdAndUpdate(
            id,
            { quantity },
            { new: true, runValidators: true },
        );
    },

    delete: async (id) => {
        return productModel.findByIdAndDelete(id)
    }
};