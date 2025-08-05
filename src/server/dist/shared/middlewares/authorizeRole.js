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
const AppError_1 = __importDefault(require("../errors/AppError"));
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user || !req.user.id) {
                return next(new AppError_1.default(401, "Unauthorized: No user found"));
            }
            const user = yield database_config_1.default.user.findUnique({
                where: { id: req.user.id },
                select: { role: true },
            });
            if (!user) {
                return next(new AppError_1.default(401, "Unauthorized: User not found"));
            }
            if (!allowedRoles.includes(user.role)) {
                return next(new AppError_1.default(403, "You are not authorized to perform this action"));
            }
            next();
        }
        catch (error) {
            return next(new AppError_1.default(500, "Internal server error"));
        }
    });
};
exports.default = authorizeRole;
