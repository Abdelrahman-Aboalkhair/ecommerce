"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestTimeoutMiddleware = void 0;
const constants_1 = require("../constants");
const requestTimeoutMiddleware = (req, res, next) => {
    const timeout = constants_1.RESPONSE_TIMEOUT;
    // Set timeout for the request
    req.setTimeout(timeout, () => {
        if (!res.headersSent) {
            res.status(408).json({
                success: false,
                message: "Request timeout",
                error: "REQUEST_TIMEOUT",
                timestamp: new Date().toISOString(),
            });
        }
    });
    // Set timeout for the response
    res.setTimeout(timeout, () => {
        if (!res.headersSent) {
            res.status(408).json({
                success: false,
                message: "Response timeout",
                error: "RESPONSE_TIMEOUT",
                timestamp: new Date().toISOString(),
            });
        }
    });
    next();
};
exports.requestTimeoutMiddleware = requestTimeoutMiddleware;
