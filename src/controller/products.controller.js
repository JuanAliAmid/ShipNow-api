import { productService } from "../service/product.service.js";

export const productController = {
    findAll: async (_req, res, next) => {
        try {
            const products = await productService.findAll();
            res.json({ status: 'success', payload: products });
        } catch (error) {
            next(error);
        }

    },

    findById: async (req, res, next) => {
        try {
            const producto = await productService.findById(req.params.id);
            res.json({ status: 'success', payload: producto });
        } catch (error) {
            next(error);
        }

    },

    create: async (req, res, next) => {

        try {
            const producto = await productService.create(req.body);
            res.json({ status: 'success', payload: producto })
        } catch (error) {
            next(error);
        };
    },

    updateStatus: async (req, res, next) => {
        try {
            const newStatus = await productService.updateStatus(req.params.id, req.body)
            res.json({ status: 'success', payload: newStatus })
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const deleteProduct = await productService.delete(req.params.id);
            res.json({ status: 'success', payload: deleteProduct });
        } catch (error) {
            next(error);
        }
    }
};