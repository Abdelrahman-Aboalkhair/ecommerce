"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = exports.cookieParserOptions = void 0;
exports.cookieParserOptions = {};
exports.cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    path: "/",
    domain: undefined,
};
