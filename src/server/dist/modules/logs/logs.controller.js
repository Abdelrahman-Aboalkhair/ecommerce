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
exports.LogsController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
class LogsController {
    constructor(logsService) {
        this.logsService = logsService;
        this.getLogs = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const logs = yield this.logsService.getLogs();
            (0, sendResponse_1.default)(res, 200, {
                message: "Logs fetched successfully",
                data: { logs },
            });
        }));
        this.getLogByLevel = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { level } = req.params;
            const logs = yield this.logsService.getLogByLevel(level);
            (0, sendResponse_1.default)(res, 200, {
                message: "Logs fetched successfully",
                data: { logs },
            });
        }));
        this.getLogById = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const log = yield this.logsService.getLogById(id);
            (0, sendResponse_1.default)(res, 200, {
                message: "Log fetched successfully",
                data: { log },
            });
        }));
        this.deleteLog = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield this.logsService.deleteLog(id);
            (0, sendResponse_1.default)(res, 200, {
                message: "Log deleted successfully",
            });
        }));
        this.clearLogs = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.logsService.clearLogs();
            (0, sendResponse_1.default)(res, 200, {
                message: "Logs cleared successfully",
            });
        }));
    }
}
exports.LogsController = LogsController;
