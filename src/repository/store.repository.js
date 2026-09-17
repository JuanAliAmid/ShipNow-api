import StoreModel from '../models/store.model.js';

export const storeRepository = {

  getStores: async () => {
    return StoreModel.find({ isActive: true });
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
  }
};
