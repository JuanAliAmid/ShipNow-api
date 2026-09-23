import { productService } from "../service/product.service.js";

export const productController = {
    findAll: async (_req, res) => {
        try {
            const products = await productService.findAll();
            res.json({ status: 'success', payload: products });
        } catch (error) {
            res.status(error.statusCode).json({ status: 'error', message: error.message })
        }

    },

    findById: async (req, res) => {
        try {
            const producto = await productService.findById(req.params.id);
            res.json({ status: 'success', payload: producto });
        } catch (error) {
            res.status(error.statusCode).json({ status: 'error', message: error.message })
        }

    },

    create: async (req, res) => {

        try {
            const producto = await productService.create(req.body);
            res.json({ status: 'success', payload: producto })
        } catch (error) {
            res.status(error.statusCode).json({ status: 'error', message: error.message })
        };
    },

    updateStatus: async (req, res) => {
        try {
            const newStatus = await productService.updateStatus(req.params.id, req.body)
            res.json({ status: 'success', payload: newStatus })
        } catch (error) {
            res.status(error.statusCode).json({ status: 'error', message: error.message })
        }
    },

    delete: async (req, res) => {
        try {
            const deleteProduct = await productService.delete(req.params.id);
            res.json({ status: 'success', payload: deleteProduct });
        } catch (error) {
            res.status(error.statusCode).json({ status: 'error', message: error.message })
        }
    }
};