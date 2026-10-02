import { storeRepository } from "../repository/store.repository.js";
import { createError } from "../utils/apiResponse.js";
import ERROR_CODES from "../errors/error.codes.js";

export const storeService = {
   getStores: async () => {
      const stores = await storeRepository.getStores();
      return stores;
   },

   create: async (storeData) => {
      const { name, address, owner } = storeData
      if (!name || !address || !owner) {
         throw createError(ERROR_CODES.REQUIRED_FIELDS);
      };
      const store = await storeRepository.create(storeData);

      return store;
   },

   findById: async (id) => {
      const store = await storeRepository.findById(id)
      if (!store) {
         throw createError(ERROR_CODES.STORE_NOT_FOUND);
      };
      return store;
   },

   updateStore: async (id, newData) => {
      const storeUpdate = await storeRepository.updateStore(
         id,
         newData,
         { new: true, runValidators: true },
      );

      if (!storeUpdate) {
         throw createError(ERROR_CODES.STORE_NOT_FOUND);
      };

      return storeUpdate;

   },

   delete: async (id) => {
      const store = await storeRepository.delete(id);

      if (!store) {
         throw createError(ERROR_CODES.STORE_NOT_FOUND);
      };

      return store;
   }

};