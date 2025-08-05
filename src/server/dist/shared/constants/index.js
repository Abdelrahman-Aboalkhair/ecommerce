"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = exports.cookieParserOptions = void 0;
exports.cookieParserOptions = {};
exports.cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
    domain: "localhost",
};
