import UserModel from "../models/user.model.js";

export const userRepository = {
  findById: async (id) => {
    return UserModel.findById(id);
  },

  getUsers: async () => {
    return UserModel.find()
  },

  create: async (userData) => {
    return UserModel.create(userData);
  },

  updateUser: async (id, newData) => {
    return UserModel.findByIdAndUpdate(
      id,
      newData,
      { new: true, runValidators: true },
    );
  },

  delete: async (id) => {
    return UserModel.findByIdAndDelete(id);
  }
}