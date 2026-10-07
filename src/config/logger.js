import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const levelCustom = { levels: { fatal: 0, error: 1, warn: 2, info: 3, http: 4, debug: 5 } };

const logger = winston.createLogger({
    levels: levelCustom.levels,
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}] ${message}`
        })
    )
});

logger.add(new winston.transports.Console());

const errorRotateTransport = new DailyRotateFile({
    filename: "logs/error-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    level: "error",
    maxFiles: "14d"
});

logger.add(errorRotateTransport);

export { errorRotateTransport };
export default logger;