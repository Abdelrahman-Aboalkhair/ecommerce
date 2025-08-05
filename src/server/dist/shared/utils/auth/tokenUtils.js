"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenBlacklisted = exports.blacklistToken = void 0;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = __importDefault(require("@/infra/cache/redis"));
function generateAccessToken(id) {
    return jsonwebtoken_1.default.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
}
function generateRefreshToken(id, absExp) {
    const absoluteExpiration = absExp || Math.floor(Date.now() / 1000) + 86400;
    const ttl = absoluteExpiration - Math.floor(Date.now() / 1000);
    return jsonwebtoken_1.default.sign({ id, absExp: absoluteExpiration }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: ttl,
    });
}
const blacklistToken = (token, ttl) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_1.default.set(`blacklist:${token}`, "blacklisted", "EX", ttl);
});
exports.blacklistToken = blacklistToken;
const isTokenBlacklisted = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield redis_1.default.get(`blacklist:${token}`);
        return result !== null;
    }
    catch (error) {
        console.error("Redis error:", error);
        return false;
    }
});
exports.isTokenBlacklisted = isTokenBlacklisted;
