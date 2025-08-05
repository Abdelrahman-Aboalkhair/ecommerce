"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTransactionController = void 0;
const transaction_controller_1 = require("./transaction.controller");
const transaction_repository_1 = require("./transaction.repository");
const transaction_service_1 = require("./transaction.service");
const makeTransactionController = () => {
    const repo = new transaction_repository_1.TransactionRepository();
    const service = new transaction_service_1.TransactionService(repo);
    const controller = new transaction_controller_1.TransactionController(service);
    return controller;
};
exports.makeTransactionController = makeTransactionController;
