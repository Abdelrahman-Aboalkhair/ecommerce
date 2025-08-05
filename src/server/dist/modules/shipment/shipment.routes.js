"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shipment_factory_1 = require("./shipment.factory");
const optionalAuth_1 = __importDefault(require("@/shared/middlewares/optionalAuth"));
const router = express_1.default.Router();
const shipmentController = (0, shipment_factory_1.makeShipmentController)();
/**
 * @swagger
 * /shipments:
 *   post:
 *     summary: Create a new shipment
 *     description: Creates a new shipment. Authentication is optional.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destination:
 *                 type: string
 *                 description: The destination address for the shipment.
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: List of items to be shipped.
 *               shippingMethod:
 *                 type: string
 *                 description: The shipping method used for the shipment.
 *     responses:
 *       201:
 *         description: Shipment created successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.post("/", optionalAuth_1.default, shipmentController.createShipment);
exports.default = router;
