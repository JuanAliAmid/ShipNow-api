import { PRODUCT_STATUS } from "../constants/constants.js";
import { productRepository } from "../repository/product.repository.js";

export const productService = {
    findAll: async () => {
        const products = await productRepository.findAll({ status: PRODUCT_STATUS.AVAILABLE });
        if (!products) {
            const error = new Error('Productos no encontrados');
            error.statusCode = 404;
            throw error
        }
        return products;
    },

    findById: async (id) => {
        const producto = await productRepository.findById(id);
        if (!producto) {
            const error = new Error('Producto no encontrado');
            error.statusCode = 404;
            throw error
        }
        return producto;
    },

    create: async (productData) => {
        const { name, price, quantity } = productData;
        if (!name || !price || !quantity) {
            const error = new Error('Falta campos requeridos');
            error.statusCode = 400;
            throw error;
        }
        const producto = await productRepository.create(productData);
        if (!producto) {
            const error = new Error('Producto no encontrado');
            error.statusCode = 404;
            throw error
        }
        return producto;
    },

    decrementStock: async (id, quantity) => {
        const producto = await productRepository.findById(id);
        if (!producto) {
            const error = new Error('Producto no encontrado');
            error.statusCode = 404;
            throw error
        }
        let newQuantity;
        if (producto.quantity >= quantity) {
            newQuantity = producto.quantity - quantity
            if (newQuantity === 0) {

                await productRepository.updateStatus(producto._id, PRODUCT_STATUS.OUT_OF_STOCK)
                await productRepository.updateQuantity(producto._id, 0)
                return
            }
            return productRepository.updateQuantity(producto._id, newQuantity)
        } else {
            const error = new Error('Producto no disponible');
            error.statusCode = 409;
            throw error
        }
    },

    updateStatus: async (id, status) => {
        const newStatus = await productRepository.updateStatus(
            id,
            { status },
            { new: true, runValidators: true },
        );
        if (!newStatus) {
            const error = new Error('Producto no encontrado');
            error.statusCode = 404;
            throw error
        }
        return newStatus;
    },

    delete: async (id) => {
        const deleteProduct = await productRepository.delete(id);
        if (!deleteProduct) {
            const error = new Error('Producto no encontrado');
            error.statusCode = 404;
            throw error
        };
        return deleteProduct;
    }
};