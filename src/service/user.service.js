import { userRepository } from "../repository/user.repository.js";
import { createError } from "../utils/apiResponse.js";
import ERROR_CODES from "../errors/error.codes.js";
import logger from "../config/logger.js";
import { fileTypeFromFile } from "file-type";
import deleteUploadFile from "../utils/deleteUploadFile.js";
import { allowedMimeTypes } from "../constants/constants.js";
import { DOCUMENTS_TYPES } from "../constants/constants.js";


export const userService = {
   findById: async (id) => {
      const user = await userRepository.findById(id);
      if (!user) {
         throw createError(ERROR_CODES.USER_NOT_FOUND);
      }
      return user;
   },

   getUsers: async () => {
      return userRepository.getUsers();
   },

   create: async (userData) => {
      const { firstName, lastName, email, password } = userData;
      if (!firstName || !lastName || !email || !password) {
         throw createError(ERROR_CODES.REQUIRED_FIELDS);
      };
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
      };
      return userUpdate;
   },

   delete: async (id) => {
      const userDelete = await userRepository.delete(id);
      if (!userDelete) {
         throw createError(ERROR_CODES.USER_NOT_FOUND);
      };
      return userDelete;
   },

   uploadedDocument: async (userId, file, documentType) => {
      try {

         if (!Object.values(DOCUMENTS_TYPES).includes(documentType)) {
            console.log(file.path)
            throw createError(ERROR_CODES.INVALID_DOCUMENT_TYPE);
         };

         if (!file) {
            throw createError(ERROR_CODES.NOT_RECIVED_FILE);
         };

         const user = await userRepository.findById(userId);

         if (!user) {
            throw createError(ERROR_CODES.USER_NOT_FOUND);
         };

         const fileType = await fileTypeFromFile(file.path);

         if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
            throw createError(ERROR_CODES.INVALID_FILE_TYPE);
         };

         const document = {
            originalName: file.originalname,
            filaName: file.filaname,
            path: file.path,
            mimeType: fileType.mime,
            size: file.size,
            documentType: documentType,
            uploadedAt: new Date()
         };

         const uploadUser = await userRepository.addDocument(userId, document);

         logger.info({
            message: "Usuario cargado correctamente",
            userId,
            fileName: file.filename,
            originalName: file.originalname,
            mimeType: fileType.mime,
            size: file.size
         });

         return uploadUser;
      } catch (error) {
         await deleteUploadFile(file);
         throw error;
      }
   }

};