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
exports.TransactionController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const logs_factory_1 = require("../logs/logs.factory");
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
class TransactionController {
    constructor(transactionService) {
        this.transactionService = transactionService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.getAllTransactions = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const transactions = yield this.transactionService.getAllTransactions();
            (0, sendResponse_1.default)(res, 200, {
                data: { transactions },
                message: "Fetched transactions successfully",
            });
        }));
        this.getTransactionById = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const transaction = yield this.transactionService.getTransactionById(id);
            (0, sendResponse_1.default)(res, 200, {
                data: { transaction },
                message: "Fetched transaction successfully",
            });
        }));
        this.updateTransactionStatus = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { status } = req.body;
            console.log("status => ", status);
            const updatedTransaction = yield this.transactionService.updateTransactionStatus(id, { status });
            (0, sendResponse_1.default)(res, 200, {
                data: { updatedTransaction },
                message: "Updated transaction successfully",
            });
        }));
        this.deleteTransaction = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield this.transactionService.deleteTransaction(id);
            (0, sendResponse_1.default)(res, 204, { message: "Deleted transaction successfully" });
        }));
    }
}
exports.TransactionController = TransactionController;
