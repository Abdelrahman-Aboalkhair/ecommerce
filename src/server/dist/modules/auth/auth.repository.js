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
exports.AuthRepository = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class AuthRepository {
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.user.findUnique({
                where: { email },
            });
        });
    }
    findUserByEmailWithPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    password: true,
                    role: true,
                    name: true,
                    email: true,
                    avatar: true,
                },
            });
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    avatar: true,
                },
            });
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.user.create({
                data,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    avatar: true,
                },
            });
        });
    }
    updateUserEmailVerification(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.user.update({
                where: { id: userId },
                data,
            });
        });
    }
    updateUserPasswordReset(email, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.user.update({
                where: { email },
                data,
            });
        });
    }
    findUserByResetToken(hashedToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.user.findFirst({
                where: {
                    resetPasswordToken: hashedToken,
                    resetPasswordTokenExpiresAt: { gt: new Date() },
                },
            });
        });
    }
    updateUserPassword(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.user.update({
                where: { id: userId },
                data: {
                    password,
                    resetPasswordToken: null,
                    resetPasswordTokenExpiresAt: null,
                },
            });
        });
    }
}
exports.AuthRepository = AuthRepository;
