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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsService = void 0;
class LogsService {
    constructor(logsRepository) {
        this.logsRepository = logsRepository;
    }
    getLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.logsRepository.getLogs();
        });
    }
    getLogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.logsRepository.getLogById(id);
        });
    }
    getLogByLevel(level) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.logsRepository.getLogsByLevel(level);
        });
    }
    deleteLog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.logsRepository.deleteLog(id);
        });
    }
    clearLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.logsRepository.clearLogs();
        });
    }
    log(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.context || "");
            yield this.logsRepository.createLog({
                level: entry.level,
                message: entry.message,
                context: entry.context,
            });
        });
    }
    info(message, context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.log({ level: "info", message, context });
        });
    }
    error(message, context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.log({ level: "error", message, context });
        });
    }
    warn(message, context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.log({ level: "warn", message, context });
        });
    }
    debug(message, context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.log({ level: "debug", message, context });
        });
    }
}
exports.LogsService = LogsService;
