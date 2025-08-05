"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protect_1 = __importDefault(require("@/shared/middlewares/protect"));
const transaction_factory_1 = require("./transaction.factory");
const express_1 = __importDefault(require("express"));
const authorizeRole_1 = __importDefault(require("@/shared/middlewares/authorizeRole"));
const router = express_1.default.Router();
const transactionController = (0, transaction_factory_1.makeTransactionController)();
/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Retrieves a list of all transactions (Admin or SuperAdmin only).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of transactions.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
router.get("/", protect_1.default, (0, authorizeRole_1.default)("ADMIN", "SUPERADMIN"), transactionController.getAllTransactions);
/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     description: Retrieves a specific transaction by its ID (Admin or SuperAdmin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to retrieve.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction details.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 *       404:
 *         description: Transaction not found.
 */
router.get("/:id", protect_1.default, (0, authorizeRole_1.default)("ADMIN", "SUPERADMIN"), transactionController.getTransactionById);
/**
 * @swagger
 * /transactions/status/{id}:
 *   put:
 *     summary: Update transaction status
 *     description: Updates the status of a specific transaction (Admin or SuperAdmin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to update.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction status updated successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 *       404:
 *         description: Transaction not found.
 */
router.put("/status/:id", protect_1.default, (0, authorizeRole_1.default)("ADMIN", "SUPERADMIN"), transactionController.updateTransactionStatus);
/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete transaction by ID
 *     description: Deletes a specific transaction by its ID (Admin or SuperAdmin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction deleted successfully.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 *       404:
 *         description: Transaction not found.
 */
router.delete("/:id", protect_1.default, (0, authorizeRole_1.default)("ADMIN", "SUPERADMIN"), transactionController.deleteTransaction);
exports.default = router;
