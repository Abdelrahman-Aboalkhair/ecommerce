"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, statusCode, { message = "Success", data = {}, cookies = [], headers = {}, meta, }) => {
    cookies.forEach(({ name, value, options }) => {
        res.cookie(name, value, options);
    });
    Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value);
    });
    const responsePayload = Object.assign({ success: statusCode < 400, message }, data);
    if (meta) {
        responsePayload.meta = meta;
    }
    res.status(statusCode).json(responsePayload);
};
exports.default = sendResponse;
