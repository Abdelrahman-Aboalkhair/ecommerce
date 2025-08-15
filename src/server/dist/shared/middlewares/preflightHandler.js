"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preflightHandler = void 0;
const preflightHandler = (req, res, next) => {
    // Handle preflight requests
    if (req.method === "OPTIONS") {
        // Set CORS headers for preflight
        res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        res.header("Access-Control-Allow-Headers", [
            "Origin",
            "X-Requested-With",
            "Content-Type",
            "Accept",
            "Authorization",
            "X-API-Key",
            "X-Client-Version",
            "X-Device-Type",
            "X-Platform",
            "X-API-Version",
            "Apollo-Require-Preflight", // For GraphQL
        ].join(", "));
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Max-Age", "86400"); // 24 hours
        // End preflight request
        res.status(200).end();
        return;
    }
    next();
};
exports.preflightHandler = preflightHandler;
