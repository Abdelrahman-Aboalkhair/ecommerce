"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_factory_1 = require("./cart.factory");
const optionalAuth_1 = __importDefault(require("@/shared/middlewares/optionalAuth"));
const router = express_1.default.Router();
const cartController = (0, cart_factory_1.makeCartController)();
/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     description: Retrieves the current cart of the authenticated or guest user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's cart.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.get("/", optionalAuth_1.default, cartController.getCart);
/**
 * @swagger
 * /cart/count:
 *   get:
 *     summary: Get the number of items in the cart
 *     description: Retrieves the count of items currently in the user's cart.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The number of items in the cart.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.get("/count", optionalAuth_1.default, cartController.getCartCount);
/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add item to cart
 *     description: Adds a specified item to the user's cart.
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
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added to cart successfully.
 *       400:
 *         description: Invalid input data.
 */
router.post("/", optionalAuth_1.default, cartController.addToCart);
/**
 * @swagger
 * /cart/item/{itemId}:
 *   put:
 *     summary: Update cart item
 *     description: Updates the quantity of a specific item in the user's cart.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cart item to update.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Cart item not found.
 */
router.put("/item/:itemId", optionalAuth_1.default, cartController.updateCartItem);
/**
 * @swagger
 * /cart/item/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Removes a specific item from the user's cart.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cart item to remove.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart item removed successfully.
 *       404:
 *         description: Cart item not found.
 */
router.delete("/item/:itemId", optionalAuth_1.default, cartController.removeFromCart);
/**
 * @swagger
 * /cart/merge:
 *   post:
 *     summary: Merge carts
 *     description: Merges the items from the guest cart with the authenticated user's cart.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carts merged successfully.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.post("/merge", optionalAuth_1.default, cartController.mergeCarts);
exports.default = router;
