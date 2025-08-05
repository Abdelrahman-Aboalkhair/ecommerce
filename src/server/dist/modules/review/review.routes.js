"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_factory_1 = require("./review.factory");
const protect_1 = __importDefault(require("@/shared/middlewares/protect"));
const router = (0, express_1.Router)();
const controller = (0, review_factory_1.makeReviewController)();
/**
 * @swagger
 * /reviews/{productId}:
 *   get:
 *     summary: Get reviews by product ID
 *     description: Retrieves reviews for a specific product using its ID.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve reviews for.
 *     responses:
 *       200:
 *         description: A list of reviews for the product.
 *       404:
 *         description: Product not found.
 */
router.get("/:productId", controller.getReviewsByProductId);
/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     description: Allows authenticated users to submit a new review.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.post("/", protect_1.default, controller.createReview);
/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete review by ID
 *     description: Deletes a specific review by its ID (Admin or reviewer only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *       404:
 *         description: Review not found.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.delete("/:id", protect_1.default, controller.deleteReview);
exports.default = router;
