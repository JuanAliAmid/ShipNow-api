import ERROR_CODES from '../errors/error.codes.js'
import errorsDictionary from '../errors/error.dictionary.js';
import logger from '../config/logger.js';


const error = ((err, req, res, _next) => {

   let statusCode = err.statusCode || 500;
   let errCode = err.code || ERROR_CODES.INTERNAL_SERVER_ERROR;
   let message = err.message;
   const itHasThatClue = err.code in errorsDictionary;
   const isCastError = err.name === 'CastError';
   const isMulterError = err.name === 'MulterError';
   const isValidationError = err.name === 'ValidationError';
   const isDuplicateKey = err.code === 11000;
   const isBadJson = err.type === 'entity.parse.failed';

   if (isCastError) {
      statusCode = errorsDictionary[ERROR_CODES.INVALID_DATA].statusCode;
      errCode = ERROR_CODES.INVALID_DATA;
      message = errorsDictionary[ERROR_CODES.INVALID_DATA].message;

   } else if (isDuplicateKey) {
      statusCode = errorsDictionary[ERROR_CODES.DUPLICATE_EMAIL_ADDRESS].statusCode;
      errCode = ERROR_CODES.DUPLICATE_EMAIL_ADDRESS;
      message = errorsDictionary[ERROR_CODES.DUPLICATE_EMAIL_ADDRESS].message;

   } else if (isBadJson) {
      statusCode = errorsDictionary[ERROR_CODES.INVALID_DATA].statusCode;
      errCode = ERROR_CODES.INVALID_DATA;
      message = errorsDictionary[ERROR_CODES.INVALID_DATA].message;

   } else if (isValidationError) {
      statusCode = errorsDictionary[ERROR_CODES.INVALID_DATA].statusCode;
      errCode = ERROR_CODES.INVALID_DATA;
      message = errorsDictionary[ERROR_CODES.INVALID_DATA].message;

   } else if (isMulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
         statusCode = errorsDictionary[ERROR_CODES.LIMIT_FILE_SIZE].statusCode;
         errCode = ERROR_CODES.LIMIT_FILE_SIZE;
         message = errorsDictionary[ERROR_CODES.LIMIT_FILE_SIZE].message;

      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
         statusCode = errorsDictionary[ERROR_CODES.LIMIT_UNEXPECTED_FILE].statusCode;
         errCode = ERROR_CODES.LIMIT_UNEXPECTED_FILE;
         message = errorsDictionary[ERROR_CODES.LIMIT_UNEXPECTED_FILE].message;

      } else {
         statusCode = errorsDictionary[ERROR_CODES.INTERNAL_SERVER_ERROR].statusCode;
         errCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
         message = errorsDictionary[ERROR_CODES.INTERNAL_SERVER_ERROR].message;
      };

   } else if (!itHasThatClue) {
      statusCode = errorsDictionary[ERROR_CODES.INTERNAL_SERVER_ERROR].statusCode;
      errCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
      message = errorsDictionary[ERROR_CODES.INTERNAL_SERVER_ERROR].message;

   };

   const response = {
      status: 'error',
      error: errCode,
      message: message || errorsDictionary[ERROR_CODES.VALIDATION_ERROR].message
   };

   if (statusCode >= 400 && statusCode < 500) {
      logger.warning(`${err.message}, ${req.method}, ${req.originalUrl}`);
   } else {
      logger.error(`${err.message}, ${req.method}, ${req.originalUrl}, ${err.stack}`);
   };

   res.status(statusCode).json(response);

});

export default { error };