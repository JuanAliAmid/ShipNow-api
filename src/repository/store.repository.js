import StoreModel from '../models/store.model.js';

export const storeRepository = {

   getStores: async (page, limit) => {
      const skip = (page - 1) * limit;
      return StoreModel.find({ isActive: true }).skip(skip).limit(limit);
   },

   findById: async (id) => {
      return StoreModel.findById(id)
   },

   create: async (storeData) => {
      return StoreModel.create(storeData);
   },

   updateStore: async (id, newData) => {
      return StoreModel.findByIdAndUpdate(
         id,
         newData,
         { new: true, runValidators: true },
      );
   },
   delete: async (id) => {
      return StoreModel.findByIdAndDelete(id);
   },
   createMany: async (storeData) => {
      return StoreModel.insertMany(storeData);
   }
};
