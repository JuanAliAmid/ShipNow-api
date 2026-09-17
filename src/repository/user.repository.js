import UserModel from "../models/user.model.js";

export const userRepository = {
  findById: async (id) => {
    return UserModel.findById(id).select('-password');
  },

  getUsers: async () => {
    return UserModel.find().select('-password')
  },

  create: async (userData) => {
    const newUser = await UserModel.create(userData);
    const plainUser = newUser.toObject();
    const { password, ...resto } = plainUser;
    return resto
  },

  updateUser: async (id, newData) => {
    return UserModel.findByIdAndUpdate(
      id,
      newData,
      { new: true, runValidators: true },
    ).select('-password');
  },

  delete: async (id) => {
    return UserModel.findByIdAndDelete(id).select('-password');
  }
}