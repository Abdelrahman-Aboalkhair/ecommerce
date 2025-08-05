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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
const optionalAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!accessToken) {
        return next();
    }
    try {
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            throw new Error("Access token secret is not defined");
        }
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        console.log("decoded => ", decoded);
        const user = yield database_config_1.default.user.findUnique({
            where: { id: String(decoded.id) },
            select: { id: true, emailVerified: true, role: true },
        });
        console.log("user => ", user);
        if (user) {
            req.user = user;
        }
    }
    catch (error) {
        console.log("optionalAuth error => ", error);
    }
    next();
});
exports.default = optionalAuth;
