"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default(process.env.REDIS_URL);
redis
    .on("connect", () => console.log("✅ Connected to Redis"))
    .on("error", (err) => console.error("❌ Redis error:", err));
exports.default = redis;
