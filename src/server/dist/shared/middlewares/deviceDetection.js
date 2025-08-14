"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceDetectionMiddleware = void 0;
const deviceDetectionMiddleware = (req, res, next) => {
    const userAgent = req.headers["user-agent"] || "";
    const deviceInfo = {
        type: "unknown",
        platform: "unknown",
        browser: "unknown",
        version: "unknown",
        userAgent,
    };
    // Detect device type
    if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        deviceInfo.type = "mobile";
    }
    else if (/iPad|Tablet/i.test(userAgent)) {
        deviceInfo.type = "tablet";
    }
    else {
        deviceInfo.type = "desktop";
    }
    // Detect platform
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
        deviceInfo.platform = "ios";
    }
    else if (/Android/i.test(userAgent)) {
        deviceInfo.platform = "android";
    }
    else {
        deviceInfo.platform = "web";
    }
    // Detect browser
    if (/Chrome/i.test(userAgent)) {
        deviceInfo.browser = "Chrome";
        const match = userAgent.match(/Chrome\/(\d+)/);
        if (match)
            deviceInfo.version = match[1];
    }
    else if (/Firefox/i.test(userAgent)) {
        deviceInfo.browser = "Firefox";
        const match = userAgent.match(/Firefox\/(\d+)/);
        if (match)
            deviceInfo.version = match[1];
    }
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
        deviceInfo.browser = "Safari";
        const match = userAgent.match(/Version\/(\d+)/);
        if (match)
            deviceInfo.version = match[1];
    }
    else if (/Edge/i.test(userAgent)) {
        deviceInfo.browser = "Edge";
        const match = userAgent.match(/Edge\/(\d+)/);
        if (match)
            deviceInfo.version = match[1];
    }
    else if (/MSIE|Trident/i.test(userAgent)) {
        deviceInfo.browser = "Internet Explorer";
        const match = userAgent.match(/MSIE (\d+)/);
        if (match)
            deviceInfo.version = match[1];
    }
    req.deviceInfo = deviceInfo;
    // Add device info to response headers
    res.setHeader("X-Device-Type", deviceInfo.type);
    res.setHeader("X-Platform", deviceInfo.platform);
    res.setHeader("X-Browser", deviceInfo.browser);
    res.setHeader("X-Browser-Version", deviceInfo.version);
    next();
};
exports.deviceDetectionMiddleware = deviceDetectionMiddleware;
