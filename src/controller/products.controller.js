import { productService } from "../service/product.service.js";
import { successResponse } from "../utils/apiResponse.js";

export const productController = {
    findAll: async (_req, res, next) => {
        try {
            const products = await productService.findAll();
            successResponse(res, { message: 'Lista de productos', payload: products });
        } catch (error) {
            next(error);
        };
    },

    findById: async (req, res, next) => {
        try {
            const product = await productService.findById(req.params.id);
            successResponse(res, { message: 'Producto encontrado por id', payload: product });
        } catch (error) {
            next(error);
        };
    },

    create: async (req, res, next) => {

        try {
            const product = await productService.create(req.body);
            successResponse(res, { statusCode: 201, message: 'Producto creado', payload: product });
        } catch (error) {
            next(error);
        };
    },

    update: async (req, res, next) => {
        try {
            const newProduct = await productService.update(req.params.id, req.body)
            successResponse(res, { message: 'Producto actualizado', payload: newProduct });
        } catch (error) {
            next(error);
        };
    },

    delete: async (req, res, next) => {
        try {
            const deleteProduct = await productService.delete(req.params.id);
            successResponse(res, { message: 'Producto elminado', payload: deleteProduct });
        } catch (error) {
            next(error);
        };
    }
};