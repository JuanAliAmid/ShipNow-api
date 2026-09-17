import OrderModel from '../models/order.model.js';
import { USER_ROLES } from '../constants/constants.js';

export const orderRepository = {
  findAll: async () => {
    return OrderModel.find().populate(USER_ROLES.USER).populate(USER_ROLES.STORE);
  },

  findById: async (id) => {
    return OrderModel.findById(id).populate(USER_ROLES.USER).populate(USER_ROLES.STORE);
  },

  create: async (orderData) => {
    return OrderModel.create(orderData);
  },

  updateStatus: async (id, status) => {
    return OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );
  },

  delete: async (id) => {
    return OrderModel.findByIdAndDelete(id)
  }
};
