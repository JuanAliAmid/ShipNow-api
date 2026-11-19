import ERROR_CODES from "../errors/error.codes.js"
import { createError } from "../utils/apiResponse.js"

export const block = (_req, _res, next) => {
    if (process.env.NODE_ENV === 'production') {
        return next(createError(ERROR_CODES.ENDPOINT_NOT_AVAILABLE));
    };
    next();
};