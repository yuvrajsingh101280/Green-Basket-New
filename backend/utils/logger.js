import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
        return `${timestamp} - [${level.toUpperCase()}]: ${message}`;
    })
);

const logger = createLogger({
    level: "info",
    format: logFormat,
    transports: [
        new transports.Console(),

        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/combined.log" }),

        new DailyRotateFile({
            filename: "logs/daily-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d", // delete logs older than 14 days
        }),
    ],
});

export default logger;
