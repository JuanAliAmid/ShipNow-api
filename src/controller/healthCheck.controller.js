import connectedDataBaseService from "../service/healthCheck.service.js";
import { successResponse } from "../utils/apiResponse.js"; 

const connectedDataBaseController = (req, res, next) => {
    try {
        const health = connectedDataBaseService();
        successResponse(res, { message: 'API funcionando', payload: health });
    } catch (error) {
        next(error);
    };
};

export default connectedDataBaseController;