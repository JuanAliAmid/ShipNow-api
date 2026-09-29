import { PRODUCT_STATUS } from "../constants/constants.js";
import { productRepository } from "../repository/product.repository.js";
import { createError } from "../utils/apiResponse.js";
import ERROR_CODES from "../errors/error.codes.js";

export const productService = {
   findAll: async () => {
      const products = await productRepository.findAll({ status: PRODUCT_STATUS.AVAILABLE });
      if (!products) {
         throw createError(ERROR_CODES.PRODUCT_NOT_FOUND);
      }
      return products;
   },

   findById: async (id) => {
      const producto = await productRepository.findById(id);
      if (!producto) {
         throw createError(ERROR_CODES.PRODUCT_NOT_FOUND);
      }
      return producto;
   },

   create: async (productData) => {
      const { name, price, quantity } = productData;
      if (!name || !price || !quantity) {
         throw createError(ERROR_CODES.REQUIRED_FIELDS);
      }
      const producto = await productRepository.create(productData);
      if (!producto) {
         throw createError(ERROR_CODES.PRODUCT_NOT_FOUND);
      }
      return producto;
   },

   decrementStock: async (id, quantity) => {
      const producto = await productRepository.findById(id);
      if (!producto) {
         throw createError(ERROR_CODES.PRODUCT_NOT_FOUND);
      }
      let newQuantity;
      if (producto.quantity >= quantity) {
         newQuantity = producto.quantity - quantity
         if (newQuantity === 0) {

            await productRepository.update(producto._id, { status: PRODUCT_STATUS.OUT_OF_STOCK })
            await productRepository.updateQuantity(producto._id, 0)
            return
         }
         return productRepository.updateQuantity(producto._id, newQuantity)
      } else {
         throw createError(ERROR_CODES.PRODUCT_NOT_AVAILABLE);
      };
   },

   update: async (id, newData) => {
      const newProduct = await productRepository.update(id, newData)
      if (!newProduct) {
         throw createError(ERROR_CODES.PRODUCT_NOT_FOUND);
      }
      return newProduct;
   },

   delete: async (id) => {
      const deleteProduct = await productRepository.delete(id);
      if (!deleteProduct) {
         throw createError(ERROR_CODES.PRODUCT_NOT_FOUND);
      };
      return deleteProduct;
   }
};