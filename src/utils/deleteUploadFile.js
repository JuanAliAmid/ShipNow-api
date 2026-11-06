import logger from "../config/logger.js";
import fs from 'fs';

const deleteUploadFile = async (id, file) => {
    try {
        if (!file || !file.path) return;
        await fs.promises.unlink(file.path);

    } catch (error) {
        logger.error({
            id,
            message: `Error al eliminar archivo: ${error.message}`,
            route: file.path,
        });
    };
};

export default deleteUploadFile;