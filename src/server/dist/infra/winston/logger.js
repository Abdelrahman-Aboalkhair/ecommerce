"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const logFormat = winston_1.default.format.printf((info) => {
    return `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`;
});
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.colorize(), logFormat),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: path_1.default.join(__dirname, "../logs/error.log"),
            level: "error",
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(__dirname, "../logs/combined.log"),
        }),
    ],
});
logger.exceptions.handle(new winston_1.default.transports.File({
    filename: path_1.default.join(__dirname, "../logs/exceptions.log"),
}));
exports.default = logger;
