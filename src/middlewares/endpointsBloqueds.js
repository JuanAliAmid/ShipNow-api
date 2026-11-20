import ERROR_CODES from "../errors/error.codes.js"
import { createError } from "../utils/apiResponse.js"
import { env } from "../config/index.js";

export const block = (_req, _res, next) => {
    if (env.isProd) {
        return next(createError(ERROR_CODES.ENDPOINT_NOT_AVAILABLE));
    };
    next();
};