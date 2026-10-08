import { Router } from "express";
import logger from "../config/logger.js";

const router = Router();

router.get('/loggerTest', (req, res) => {
    logger.debug('prueba debug');
    logger.http('prueba http');
    logger.info('prueba info');
    logger.error('prueba error');
    logger.fatal('prueba fatal');
    logger.warning('prueba warning');

    res.json({status: 'sucess', message: 'logs generados correctamente'});
})

export default router;