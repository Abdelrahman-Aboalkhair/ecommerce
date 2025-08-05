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
exports.TransactionService = void 0;
const logs_factory_1 = require("../logs/logs.factory");
class TransactionService {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
        this.logsService = (0, logs_factory_1.makeLogsService)();
    }
    getAllTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield this.transactionRepository.findMany();
            return transactions;
        });
    }
    getTransactionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.transactionRepository.findById(id);
            return transaction;
        });
    }
    updateTransactionStatus(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.transactionRepository.updateTransaction(id, data);
            return transaction;
        });
    }
    deleteTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transactionRepository.deleteTransaction(id);
        });
    }
}
exports.TransactionService = TransactionService;
