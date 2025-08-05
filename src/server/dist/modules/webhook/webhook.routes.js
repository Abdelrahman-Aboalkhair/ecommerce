"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const webhook_factory_1 = require("./webhook.factory");
const router = express_1.default.Router();
const webhookController = (0, webhook_factory_1.makeWebhookController)();
/**
 * @swagger
 * /webhook:
 *   post:
 *     summary: Handle webhook events
 *     description: Receives and processes incoming webhook events.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: Webhook processed successfully.
 *       400:
 *         description: Invalid webhook payload.
 */
router.post("/", body_parser_1.default.raw({ type: "application/json" }), webhookController.handleWebhook);
exports.default = router;
