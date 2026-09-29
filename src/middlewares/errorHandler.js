import ERROR_CODES from '../errors/error.codes.js'
import errorsDictionary from '../errors/error.dictionary.js';


const error = ((err, _req, res, _next) => {

   let statusCode = err.statusCode || 500;
   let errCode = err.code || ERROR_CODES.INTERNAL_SERVER_ERROR;
   let message = err.message;

   if (err.name === 'CastError') {

      statusCode = errorsDictionary[ERROR_CODES.INVALID_DATA].statusCode;
      errCode = ERROR_CODES.INVALID_DATA;
      message = errorsDictionary[ERROR_CODES.INVALID_DATA].message;

   } else if (err.code === 11000) {

      statusCode = errorsDictionary[ERROR_CODES.DUPLICATE_EMAIL_ADDRESS].statusCode;
      errCode = ERROR_CODES.DUPLICATE_EMAIL_ADDRESS;
      message = errorsDictionary[ERROR_CODES.DUPLICATE_EMAIL_ADDRESS].message;

   };

   const response = {
      status: 'error',
      error: errCode,
      message: message || errorsDictionary[ERROR_CODES.VALIDATION_ERROR].message
   };

   res.status(statusCode).json(response);

});

export default { error };