import { orderRepository } from '../repository/order.repository.js';
import { userRepository } from '../repository/user.repository.js';
import { storeRepository } from '../repository/store.repository.js';
import { ORDER_STATUS } from '../constants/constants.js';
import { productService } from './product.service.js';
import { productRepository } from '../repository/product.repository.js';
import { createError } from '../utils/apiResponse.js';
import ERROR_CODES from '../errors/error.codes.js';
import logger from '../config/logger.js';

export const orderService = {
   getOrders: async () => {
      return orderRepository.findAll();
   },

   getOrderById: async (id) => {
      const order = await orderRepository.findById(id);

      if (!order) {
         throw createError(ERROR_CODES.ORDER_NOT_FOUND);
      }

      return order;
   },

   createOrder: async (orderData) => {
      const { customer, store, items, deliveryAddress, priority } = orderData;

      if (!customer || !store || !items || !deliveryAddress) {
         throw createError(ERROR_CODES.REQUIRED_FIELDS);
      }
      const userFound = await userRepository.findById(customer);
      if (!userFound) {
         throw createError(ERROR_CODES.USER_NOT_FOUND);
      }

      const storeFound = await storeRepository.findById(store);
      if (!storeFound) {
         throw createError(ERROR_CODES.STORE_NOT_FOUND);
      };

      const ordersItems = [];

      if (items.length <= 0 || !Array.isArray(items)) {
         throw createError(ERROR_CODES.INVALID_DATA);
      }

      for (const item of items) {

         if (item.quantity <= 0 || Number.isInteger(item.quantity) === false) {
            throw createError(ERROR_CODES.INVALID_QUANTITY);
         };

         const product = await productRepository.findById(item.product);

         if (!product) {
            throw createError(ERROR_CODES.PRODUCT_NOT_FOUND);
         };
         if (product.quantity < item.quantity) {
            throw createError(ERROR_CODES.PRODUCT_NOT_AVAILABLE);
         };
         ordersItems.push({ name: product.name, price: product.price, quantity: item.quantity, product: item.product })
      }

      for (const item of items) {
         await productService.decrementStock(item.product, item.quantity);
      }

      const total = ordersItems.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);

      const newOrder = {
         ...orderData,
         items: ordersItems,
         total,
         status: ORDER_STATUS.CREATED,
         priority: priority ? priority : 'normal',
      };

      const newOrderCreate = await orderRepository.create(newOrder);

      logger.info(`Orden ${newOrderCreate._id} creada correctamente`);

      return newOrderCreate;
   },

   updateOrderStatus: async (id, status) => {

      if (!Object.values(ORDER_STATUS).includes(status)) {
         throw createError(ERROR_CODES.INVALID_ORDER_STATUS);
      };
      const order = await orderRepository.updateStatus(id, status);
      if (!order) {
         logger.warning(`Orden con id: ${id} no encontrada`);
         throw createError(ERROR_CODES.ORDER_NOT_FOUND);
      };

      return order;
   },

   deleteOrder: async (id) => {
      const order = await orderRepository.delete(id);
      if (!order) {
         throw createError(ERROR_CODES.ORDER_NOT_FOUND);
      };

      return order;
   },
};
