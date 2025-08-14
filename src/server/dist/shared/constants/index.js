"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = exports.cookieParserOptions = void 0;
exports.cookieParserOptions = {};
exports.cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
    domain: process.env.NODE_ENV === "production" ? "ssr-ecommerce" : "localhost",
};
