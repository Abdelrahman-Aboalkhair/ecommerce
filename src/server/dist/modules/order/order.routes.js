"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protect_1 = __importDefault(require("@/shared/middlewares/protect"));
const authorizeRole_1 = __importDefault(require("@/shared/middlewares/authorizeRole"));
const order_factory_1 = require("./order.factory");
const router = express_1.default.Router();
const orderController = (0, order_factory_1.makeOrderController)();
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     description: Retrieves all orders in the system. Accessible only by admins and superadmins.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all orders.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
router.get("/", protect_1.default, (0, authorizeRole_1.default)("ADMIN", "SUPERADMIN"), orderController.getAllOrders);
/**
 * @swagger
 * /orders/user:
 *   get:
 *     summary: Get user orders
 *     description: Retrieves all orders placed by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders placed by the user.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.get("/user", protect_1.default, orderController.getUserOrders);
/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get order details
 *     description: Retrieves detailed information about a specific order.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to retrieve.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The details of the specified order.
 *       404:
 *         description: Order not found.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.get("/:orderId", protect_1.default, orderController.getOrderDetails);
exports.default = router;
