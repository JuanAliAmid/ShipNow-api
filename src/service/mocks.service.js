import { userRepository } from '../repository/user.repository.js';
import { orderRepository } from '../repository/order.repository.js';
import { deliveryRepository } from '../repository/delivery.repository.js';
import { storeRepository } from '../repository/store.repository.js';
import { USER_ROLES } from '../constants/constants.js';
import { productRepository } from '../repository/product.repository.js';
import { createError } from '../utils/apiResponse.js';
import usersMock from '../mocks/users.mock.js';
import ordersMock from '../mocks/orders.mock.js';
import deliveriesMock from '../mocks/deliveries.mock.js';
import mongoose from 'mongoose';
import storesMock from '../mocks/store.mock.js';
import ERROR_CODES from '../errors/error.codes.js';
import logger from '../config/logger.js';

const removePassword = (array) => {
   const arrayMap = array.map((a) => {
      const { password, ...resto } = a;
      return resto;
   });
   return arrayMap;
}

const qtyConditional = (quantity) => {
   if (!/^\d+$/.test(quantity) || quantity <= 0 || quantity > 50) {
      logger.warning(`Cantidad invalida: ${quantity}`);
      throw createError(ERROR_CODES.INVALID_QUANTITY);
   };

   quantity = Number(quantity);

   return quantity;
};

const users = async (quantity) => {
   quantity = qtyConditional(quantity);

   const mockUsers = usersMock.generateMockUserQuantity(quantity);

   logger.info(`Se generaron ${quantity} mocks de users`);

   return removePassword(mockUsers);
};

const orders = async (quantity) => {
   quantity = qtyConditional(quantity);

   const userIds = Array.from({ length: quantity }, () => { return new mongoose.Types.ObjectId() });
   const storeIds = Array.from({ length: quantity }, () => { return new mongoose.Types.ObjectId() });
   const products = await productRepository.findAll();

   if (products.length === 0) {
      throw createError(ERROR_CODES.NO_SAVED_PRODUCTS);
   };

   const orders = ordersMock.generateMockOrders(userIds, storeIds, products, quantity);

   logger.info(`Se generaron ${quantity} mocks de orders`);

   return orders;

};

const drivers = async (quantity) => {
   quantity = qtyConditional(quantity);

   const mockDrivers = usersMock.generateMockDrivers(quantity);

   logger.info(`Se generaron ${quantity} mocks de drivers`);

   return removePassword(mockDrivers);
};

const deliveries = async (quantity) => {
   quantity = qtyConditional(quantity);

   const orderId = Array.from({ length: quantity }, () => { return new mongoose.Types.ObjectId() })
   const driverId = Array.from({ length: quantity }, () => { return new mongoose.Types.ObjectId() })
   const delivery = Array.from({ length: quantity }, (_, index) => {
      return deliveriesMock.generateMockDelivery(orderId[index % orderId.length], driverId[index % driverId.length], index)
   });

   logger.info(`Se generaron ${quantity} mocks de deliveries`);

   return delivery;
};



const saveMocks = async (type, qty) => {
   qty = qtyConditional(qty);
   try {
      switch (type) {
         case 'users':

            const users = usersMock.generateMockUserQuantity(qty)

            const usersSave = await userRepository.createMany(users);

            logger.info(`Users guardados correctamente`);

            return usersSave;

         case 'orders':

            const ids = (await userRepository.getUsers()).filter((a) => a.role === USER_ROLES.USER);
            const idsStore = await storeRepository.getStores();
            const idsProduct = await productRepository.findAll();

            if (ids.length === 0) {
               throw createError(ERROR_CODES.USER_NOT_FOUND);
            }
            if (idsStore.length === 0) {
               throw createError(ERROR_CODES.STORE_NOT_FOUND);
            }
            if (idsProduct.length === 0) {
               throw createError(ERROR_CODES.PRODUCT_NOT_FOUND);
            }

            const orders = ordersMock.generateMockOrders(ids.map((a) => a._id), idsStore.map((a) => a._id), idsProduct, qty);

            const ordersSave = await orderRepository.createMany(orders);

            logger.info(`Orders guardados correctamente`);

            return ordersSave;

         case 'drivers':

            const drivers = usersMock.generateMockDrivers(qty);

            const driversSave = await userRepository.createMany(drivers);

            logger.info(`Drivers guardados correctamente`);

            return driversSave;

         case 'deliveries':

            const orderId = (await orderRepository.findAll()).map((a) => a._id);
            const driverId = (await userRepository.getUsers()).filter((a) => a.role === USER_ROLES.DRIVER).map((a) => a._id);

            if (orderId.length === 0) {
               throw createError(ERROR_CODES.ORDER_NOT_FOUND);
            }
            if (driverId.length === 0) {
               throw createError(ERROR_CODES.DRIVERS_NOT_FOUND);
            }

            const delivery = Array.from({ length: qty }, (_, index) => {
               return deliveriesMock.generateMockDelivery(orderId[index % orderId.length], driverId[index % driverId.length], index)
            })

            const deliverySave = await deliveryRepository.createMany(delivery);

            logger.info(`Deliverys guardados correctamente`);

            return deliverySave;

         case 'stores':

            const userId = (await userRepository.getUsers()).filter((a) => a.role === USER_ROLES.STORE);

            if (userId.length === 0) {
               throw createError(ERROR_CODES.USER_NOT_FOUND);
            }

            const stores = storesMock.generateMockStores(userId.map((a) => a._id), qty);

            const storesSave = await storeRepository.createMany(stores);

            logger.info(`Stores guardados correctamente`);

            return storesSave;

         case 'storeOwner':

            const store = usersMock.generateMockUserWithStoreRole(qty);
            const storeSave = await userRepository.createMany(store);
            logger.info(`storeOwners guardados correctamente`);
            return storeSave;

         default:
            throw createError(ERROR_CODES.TYPE_NOT_FOUND);
      };
   } catch (error) {
      if (error.statusCode) throw error;
      logger.error(`${error.message}, ${error.stack}, ${type}, ${qty}`)
      throw createError(ERROR_CODES.SAVE_MOCKS_FAILED)
   }

};

export default {
   users,
   orders,
   saveMocks,
   drivers,
   deliveries
};