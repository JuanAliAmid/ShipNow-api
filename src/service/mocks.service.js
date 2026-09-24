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

const users = async (quantity) => {

   const user = usersMock.generateMockUserQuantity(quantity);
   if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error
   }
   return user;
};

const orders = async (quantity) => {

   const userIds = Array.from({ length: quantity }, () => { return new mongoose.Types.ObjectId() })
   const storeIds = Array.from({ length: quantity }, () => { return new mongoose.Types.ObjectId() })
   const productIds = Array.from({ length: quantity }, () => { return new mongoose.Types.ObjectId() })
   const order = ordersMock.generateMockOrders(userIds, storeIds, productIds, quantity)
   if (!order) {
      const error = new Error('Orden no encontrada');
      error.statusCode = 404;
      throw error
   }
   return order;
};

const drivers = async (quantity) => {
   const drivers = usersMock.generateMockDrivers(quantity)

   if (!drivers) {
      const error = new Error('Drivers no encontrados');
      error.statusCode = 404;
      throw error
   }
   return drivers;

};
const deliveries = async (quantity) => {
   const orderId = Array.from({ length: quantity }, () => { return new mongoose.Types.ObjectId() })
   const driverId = Array.from({ length: quantity }, () => { return new mongoose.Types.ObjectId() })
   const delivery = Array.from({ length: quantity }, (_, index) => {
      return deliveriesMock.generateMockDelivery(orderId[index % orderId.length], driverId[index % driverId.length], index)
   });
   if (!delivery) {
      const error = new Error('Dekivery no encontrado');
      error.statusCode = 404;
      throw error
   }
   return delivery;
};



const saveMocks = async (type, qty) => {

   switch (type) {
      case 'users':

         const users = usersMock.generateMockUserQuantity(qty).map((a) => userRepository.create(a))
         return await Promise.all(users);

      case 'orders':

         const ids = (await userRepository.getUsers()).filter((a) => a.role === USER_ROLES.USER);
         const idsStore = await storeRepository.getStores();
         const idsProduct = await productRepository.findAll();
         const orders = ordersMock.generateMockOrders(ids.map((a) => a._id), idsStore.map((a) => a._id), idsProduct.map((a) => a._id), qty).map((a) => orderRepository.create(a))
         return await Promise.all(orders);

      case 'drivers':

         const drivers = usersMock.generateMockDrivers(qty).map((a) => userRepository.create(a));
         return await Promise.all(drivers);

      case 'deliveries':

         const orderId = (await orderRepository.findAll()).map((a) => a._id);
         const driverId = (await userRepository.getUsers()).filter((a) => a.role === USER_ROLES.DRIVER).map((a) => a._id);
         const delivery = Array.from({ length: qty }, (_, index) => {
            return deliveriesMock.generateMockDelivery(orderId[index % orderId.length], driverId[index % driverId.length], index)
         })
         const saveDelivery = delivery.map((a) => deliveryRepository.create(a));
         return await Promise.all(saveDelivery);

      case 'stores':

         const userId = (await userRepository.getUsers()).filter((a) => a.role === USER_ROLES.STORE);
         const stores = storesMock.generateMockStores(userId.map((a) => a._id), qty).map((a) => storeRepository.create(a));
         return await Promise.all(stores);

      case 'storeOwner':

         const store = usersMock.generateMockUserWithStoreRole(qty).map((a) => userRepository.create(a));
         return await Promise.all(store);

      default:
         const error = new Error('Tipo no encontrado');
         error.statusCode = 400;
         throw error
   };
};

export default {
   users,
   orders,
   saveMocks,
   drivers,
   deliveries
};