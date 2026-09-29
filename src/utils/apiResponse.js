import ERROR_CODES from "../errors/error.codes.js";
import errorsDictionary from "../errors/error.dictionary.js";
import { AppError } from "../errors/appError.js";

export const successResponse = (res, { statusCode = 200, message = '', payload = {} }) => {
    return res.status(statusCode).json({ status: 'success', message, payload });
};

export const createError = (code) => {
    const isInDictionary = code in errorsDictionary;
    const activeCode = isInDictionary ? code : ERROR_CODES.INTERNAL_SERVER_ERROR;
    const configError = errorsDictionary[activeCode];

    return new AppError(configError.message, configError.statusCode, activeCode);
};


