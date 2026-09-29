import { userRepository } from "../repository/user.repository.js";
import { createError } from "../utils/apiResponse.js";
import ERROR_CODES from "../errors/error.codes.js";

export const userService = {
   findById: async (id) => {
      const user = await userRepository.findById(id);
      if (!user) {
         throw createError(ERROR_CODES.USER_NOT_FOUND);
      }
      return user;
   },

   getUsers: async () => {
      return userRepository.getUsers()
   },

   create: async (userData) => {
      const { firstName, lastName, email, password } = userData
      if (!firstName || !lastName || !email || !password) {
         throw createError(ERROR_CODES.REQUIRED_FIELDS);
      }
      const newUser = await userRepository.create(userData);
      return newUser;
   },

   updateUser: async (id, newData) => {
      const userUpdate = await userRepository.updateUser(
         id,
         newData,
         { new: true, runValidators: true },
      );
      if (!userUpdate) {
         throw createError(ERROR_CODES.USER_NOT_FOUND);
      }
      return userUpdate;
   },

   delete: async (id) => {
      const userDelete = await userRepository.delete(id);
      if (!userDelete) {
         throw createError(ERROR_CODES.USER_NOT_FOUND);
      }
      return userDelete;
   }
}