import winston from "winston";
import { env } from "../config/index.js";

const levelCustom = { levels: { fatal: 0, error: 1, warning: 2, info: 3, http: 4, debug: 5 } };

const logger = winston.createLogger({
    levels: levelCustom.levels,
    level: env.log_level,

    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}] ${message}`
        })
    )
});

if (env.nodeEnv === 'development') {
    logger.add(new winston.transports.Console());
};

const errorFileTransport = new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    maxsize: 5 * 1024 * 1024,
    maxFiles: 5,
    tailable: true
});

const combinedFileTransport = new winston.transports.File({
    filename: "logs/combined.log",
    maxsize: 5 * 1024 * 1024,
    maxFiles: 5,
    tailable: true
});

logger.add(errorFileTransport);
logger.add(combinedFileTransport);

export { errorFileTransport };
export default logger;