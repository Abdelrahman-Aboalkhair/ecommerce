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
exports.UserRepository = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class UserRepository {
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_config_1.default.user.findMany();
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_config_1.default.user.findUnique({
                where: { id },
                select: { id: true, avatar: true, role: true },
            });
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_config_1.default.user.findUnique({ where: { email } });
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_config_1.default.user.update({ where: { id }, data });
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_config_1.default.user.delete({ where: { id } });
        });
    }
}
exports.UserRepository = UserRepository;
