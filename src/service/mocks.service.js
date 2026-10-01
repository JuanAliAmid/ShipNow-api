import { userRepository } from '../repository/user.repository.js';
import { orderRepository } from '../repository/order.repository.js';
import { deliveryRepository } from '../repository/delivery.repository.js';
import { storeRepository } from '../repository/store.repository.js';
import { USER_ROLES } from '../constants/constants.js';
import { productRepository } from '../repository/product.repository.js';
import usersMock from '../mocks/users.mock.js';
import ordersMock from '../mocks/orders.mock.js';
import deliveriesMock from '../mocks/deliveries.mock.js';
import mongoose from 'mongoose';
import storesMock from '../mocks/store.mock.js';
import { createError } from '../utils/apiResponse.js';
import ERROR_CODES from '../errors/error.codes.js';

const qtyConditional = (quantity) => {
   quantity = Number(quantity);
   if (!Number.isInteger(quantity)) {
      throw createError(ERROR_CODES.INVALID_QUANTITY);
   } else if (quantity <= 0) {
      throw createError(ERROR_CODES.INVALID_QUANTITY);
   } else if (quantity > 50) {
      throw createError(ERROR_CODES.INVALID_QUANTITY);
   }
   return quantity;
}

const users = async (quantity) => {
   quantity = qtyConditional(quantity);

   const user = usersMock.generateMockUserQuantity(quantity);

   return user;
};

const orders = async (quantity) => {
   quantity = qtyConditional(quantity);

   const userIds = Array.from({ length: quantity }, () => { return new mongoose.Types.ObjectId() });
   const storeIds = Array.from({ length: quantity }, () => { return new mongoose.Types.ObjectId() });
   const products = await productRepository.findAll();

   if (products.length === 0) {
      throw createError(ERROR_CODES.NO_SAVED_PRODUCTS);
   };
   return ordersMock.generateMockOrders(userIds, storeIds, products, quantity);
};

const drivers = async (quantity) => {
   quantity = qtyConditional(quantity);

   const drivers = usersMock.generateMockDrivers(quantity)

   return drivers;
};
const deliveries = async (quantity) => {
   quantity = qtyConditional(quantity);

   const orderId = Array.from({ length: quantity }, () => { return new mongoose.Types.ObjectId() })
   const driverId = Array.from({ length: quantity }, () => { return new mongoose.Types.ObjectId() })
   const delivery = Array.from({ length: quantity }, (_, index) => {
      return deliveriesMock.generateMockDelivery(orderId[index % orderId.length], driverId[index % driverId.length], index)
   });

   return delivery;
};



const saveMocks = async (type, qty) => {
   qty = qtyConditional(qty);
   try {
      switch (type) {
         case 'users':

            const users = usersMock.generateMockUserQuantity(qty).map((a) => userRepository.create(a))
            return await Promise.all(users);

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

            const orders = ordersMock.generateMockOrders(ids.map((a) => a._id), idsStore.map((a) => a._id), idsProduct.map((a) => a._id), qty).map((a) => orderRepository.create(a))
            return await Promise.all(orders);

         case 'drivers':

            const drivers = usersMock.generateMockDrivers(qty).map((a) => userRepository.create(a));
            return await Promise.all(drivers);

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

            const saveDelivery = delivery.map((a) => deliveryRepository.create(a));
            return await Promise.all(saveDelivery);

         case 'stores':

            const userId = (await userRepository.getUsers()).filter((a) => a.role === USER_ROLES.STORE);

            if (userId.length === 0) {
               throw createError(ERROR_CODES.USER_NOT_FOUND);

            }
            
            const stores = storesMock.generateMockStores(userId.map((a) => a._id), qty).map((a) => storeRepository.create(a));
            return await Promise.all(stores);

         case 'storeOwner':

            const store = usersMock.generateMockUserWithStoreRole(qty).map((a) => userRepository.create(a));
            return await Promise.all(store);

         default:
            throw createError(ERROR_CODES.TYPE_NOT_FOUND);
      };
   } catch (error) {
      if (error.statusCode) throw error;
      console.error(error);
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