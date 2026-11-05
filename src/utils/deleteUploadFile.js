import logger from "../config/logger.js";
import fs from 'fs';

const deleteUploadFile = async (orderId, file) => {
    try {
        if (!file || !file.path) return;
        await fs.promises.unlink(file.path);

    } catch (error) {
        logger.error({
            orderId,
            message: `Error al eliminar orden: ${error.message}`,
            route: file.path,
        });
    };
};

export default deleteUploadFile;