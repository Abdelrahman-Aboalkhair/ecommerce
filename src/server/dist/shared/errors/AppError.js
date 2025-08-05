"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(statusCode, message, isOperational = true, details) {
        if (typeof statusCode !== "number")
            throw new Error("statusCode must be a number");
        if (typeof message !== "string")
            throw new Error("message must be a string");
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
