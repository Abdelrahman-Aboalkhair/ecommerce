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
exports.LogsRepository = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class LogsRepository {
    constructor() {
    }
    getLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.log.findMany({
                take: 100,
                orderBy: { createdAt: "desc" },
            });
        });
    }
    getLogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.log.findUnique({
                where: { id },
            });
        });
    }
    getLogsByLevel(level) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.log.findMany({
                where: { level },
            });
        });
    }
    deleteLog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.log.delete({
                where: { id },
            });
        });
    }
    clearLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.log.deleteMany();
        });
    }
    createLog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.log.create({
                data: {
                    level: data.level,
                    message: data.message,
                    context: data.context,
                },
            });
        });
    }
}
exports.LogsRepository = LogsRepository;
