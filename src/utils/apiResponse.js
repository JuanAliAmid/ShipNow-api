import ERROR_CODES from "../errors/error.codes.js";
import errorsDictionary from "../errors/error.dictionary.js";

export const successResponse = (res, { statusCode = 200, message = '', payload = {} }) => {
    return res.status(statusCode).json({ status: 'success', message, payload });
};

export const createError = (code) => {
    const isInDictionary = code in errorsDictionary;
    const activeCode = isInDictionary ? code : ERROR_CODES.INTERNAL_SERVER_ERROR;
    const configError = errorsDictionary[activeCode];

    const error = new Error(configError.message);
    error.statusCode = configError.statusCode;
    error.code = activeCode;
    
    return error;
};


