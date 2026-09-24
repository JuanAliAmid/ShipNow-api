import { storeRepository } from "../repository/store.repository.js";

export const storeService = {
   getStores: async () => {

      const stores = await storeRepository.getStores();
      if (!stores) {
         const error = new Error('No hay tiendas disponibles');
         error.statusCode = 404;
         throw error;
      };

      return stores;
   },

   create: async (storeData) => {
      const { name, address, owner } = storeData
      if (!name || !address || !owner) {
         const error = new Error('Faltan datos obligatorios');
         error.statusCode = 400;
         throw error;
      };
      const store = await storeRepository.create(storeData);

      return store;
   },

   findById: async (id) => {
      const store = await storeRepository.findById(id)
      if (!store) {
         const error = new Error('Comercio no encontrado');
         error.statusCode = 404;
         throw error;
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
         const error = new Error('Comercio no encontrado');
         error.statusCode = 404;
         throw error;
      };

      return storeUpdate;

   },

   delete: async (id) => {
      const store = await storeRepository.delete(id);

      if (!store) {
         const error = new Error('Comercio no encontrado');
         error.statusCode = 400;
         throw error;
      };

      return store;
   }

};