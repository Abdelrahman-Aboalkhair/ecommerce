"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiVersioningMiddleware = void 0;
const constants_1 = require("../constants");
const apiVersioningMiddleware = (req, res, next) => {
    // Check for version in URL path
    const pathVersion = req.path.match(/\/api\/v(\d+)/);
    if (pathVersion) {
        req.apiVersion = `v${pathVersion[1]}`;
    }
    // Check for version in headers
    const headerVersion = req.headers["x-api-version"] || req.headers["accept-version"];
    if (headerVersion && !req.apiVersion) {
        req.apiVersion = headerVersion;
    }
    // Check for version in query parameter
    const queryVersion = req.query.version;
    if (queryVersion && !req.apiVersion) {
        req.apiVersion = queryVersion;
    }
    // Set default version if none specified
    if (!req.apiVersion) {
        req.apiVersion = constants_1.DEFAULT_API_VERSION;
    }
    // Validate version
    const validVersions = Object.values(constants_1.API_VERSIONS);
    if (!validVersions.includes(req.apiVersion)) {
        return res.status(400).json({
            success: false,
            message: `Invalid API version. Supported versions: ${validVersions.join(", ")}`,
            supportedVersions: validVersions,
            requestedVersion: req.apiVersion,
        });
    }
    // Add version info to response headers
    res.setHeader("X-API-Version", req.apiVersion);
    res.setHeader("X-API-Supported-Versions", validVersions.join(", "));
    next();
};
exports.apiVersioningMiddleware = apiVersioningMiddleware;
