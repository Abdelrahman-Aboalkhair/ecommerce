"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protect_1 = __importDefault(require("@/shared/middlewares/protect"));
const payment_factory_1 = require("./payment.factory");
const router = express_1.default.Router();
const paymentController = (0, payment_factory_1.makePaymentController)();
/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get user's payments
 *     description: Retrieves a list of all payments made by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of payments.
 */
router.get("/", protect_1.default, paymentController.getUserPayments);
/**
 * @swagger
 * /payments/{paymentId}:
 *   get:
 *     summary: Get payment details by ID
 *     description: Retrieves details of a specific payment by its ID.
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment to retrieve.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment details.
 *       404:
 *         description: Payment not found.
 */
router.get("/:paymentId", protect_1.default, paymentController.getPaymentDetails);
/**
 * @swagger
 * /payments/{paymentId}:
 *   delete:
 *     summary: Delete payment by ID
 *     description: Deletes a specific payment by its ID.
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment deleted successfully.
 *       404:
 *         description: Payment not found.
 */
router.delete("/:paymentId", protect_1.default, paymentController.deletePayment);
exports.default = router;
