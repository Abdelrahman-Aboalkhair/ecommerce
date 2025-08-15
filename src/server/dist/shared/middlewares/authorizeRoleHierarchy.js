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
const getRoleHierarchy = (role) => {
    const hierarchy = { USER: 1, ADMIN: 2, SUPERADMIN: 3 };
    return hierarchy[role] || 0;
};
const authorizeRoleHierarchy = (minRequiredRole) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user || !req.user.id) {
                return next(new AppError_1.default(401, "Unauthorized: No user found"));
            }
            const userRole = req.user.role;
            const targetUserId = req.params.id;
            if (!targetUserId) {
                return next(new AppError_1.default(400, "Target user ID is required"));
            }
            // Get target user's role
            const targetUser = yield database_config_1.default.user.findUnique({
                where: { id: targetUserId },
                select: { role: true }
            });
            if (!targetUser) {
                return next(new AppError_1.default(404, "Target user not found"));
            }
            // Check if user has minimum required role
            if (getRoleHierarchy(userRole) < getRoleHierarchy(minRequiredRole)) {
                return next(new AppError_1.default(403, "You are not authorized to perform this action"));
            }
            // Prevent modifying users with equal or higher roles
            if (getRoleHierarchy(targetUser.role) >= getRoleHierarchy(userRole)) {
                return next(new AppError_1.default(403, "Cannot modify users with equal or higher privileges"));
            }
            next();
        }
        catch (error) {
            return next(new AppError_1.default(500, "Internal server error"));
        }
    });
};
exports.default = authorizeRoleHierarchy;
