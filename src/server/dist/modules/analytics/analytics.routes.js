"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_factory_1 = require("./analytics.factory");
const protect_1 = __importDefault(require("@/shared/middlewares/protect"));
const router = (0, express_1.Router)();
const controller = (0, analytics_factory_1.makeAnalyticsController)();
/**
 * @swagger
 * /analytics/interactions:
 *   post:
 *     summary: Create interaction record
 *     description: Logs a new user interaction for analytics purposes.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               interactionType:
 *                 type: string
 *               interactionDetails:
 *                 type: string
 *     responses:
 *       201:
 *         description: Interaction successfully created.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.post("/interactions", protect_1.default, controller.createInteraction);
/**
 * @swagger
 * /analytics/year-range:
 *   get:
 *     summary: Get analytics for a year range
 *     description: Retrieves analytics data for a specified year range.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data for the specified year range.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.get("/year-range", protect_1.default, controller.getYearRange);
/**
 * @swagger
 * /analytics/export:
 *   get:
 *     summary: Export analytics data
 *     description: Exports the analytics data, typically for reporting or data analysis.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data successfully exported.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.get("/export", protect_1.default, controller.exportAnalytics);
exports.default = router;
