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
const redis_1 = __importDefault(require("@/infra/cache/redis"));
// Blacklist token in Redis
const blacklistToken = (token, ttl) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_1.default.set(`blacklist:${token}`, "blacklisted", "EX", ttl);
});
exports.blacklistToken = blacklistToken;
// Check if token is blacklisted
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
