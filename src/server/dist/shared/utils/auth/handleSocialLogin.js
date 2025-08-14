"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const handleSocialLogin = (provider) => {
    const scopes = provider === "google"
        ? ["email", "profile"]
        : provider === "facebook"
            ? ["email", "public_profile"]
            : [];
    return passport_1.default.authenticate(provider, {
        session: false,
        scope: scopes,
    });
};
exports.default = handleSocialLogin;
