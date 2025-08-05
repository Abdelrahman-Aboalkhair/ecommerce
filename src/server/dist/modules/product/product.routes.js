"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorizeRole_1 = __importDefault(require("@/shared/middlewares/authorizeRole"));
const protect_1 = __importDefault(require("@/shared/middlewares/protect"));
const product_factory_1 = require("./product.factory");
const upload_1 = __importDefault(require("@/shared/middlewares/upload"));
const router = express_1.default.Router();
const productController = (0, product_factory_1.makeProductController)();
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Retrieves a list of all products.
 *     responses:
 *       200:
 *         description: A list of products.
 */
router.get("/", productController.getAllProducts);
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieves a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve.
 *     responses:
 *       200:
 *         description: Product details.
 *       404:
 *         description: Product not found.
 */
router.get("/:id", productController.getProductById);
/**
 * @swagger
 * /products/slug/{slug}:
 *   get:
 *     summary: Get product by slug
 *     description: Retrieves a specific product by its slug.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the product to retrieve.
 *     responses:
 *       200:
 *         description: Product details.
 *       404:
 *         description: Product not found.
 */
router.get("/slug/:slug", productController.getProductBySlug);
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product
 *     description: Updates a specific product by its ID (Admin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
router.put("/:id", protect_1.default, (0, authorizeRole_1.default)("ADMIN", "SUPERADMIN"), upload_1.default.array("images", 10), productController.updateProduct);
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create new product
 *     description: Creates a new product (Admin only).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
router.post("/", protect_1.default, (0, authorizeRole_1.default)("ADMIN", "SUPERADMIN"), upload_1.default.any(), productController.createProduct);
/**
 * @swagger
 * /products/bulk:
 *   post:
 *     summary: Bulk create products
 *     description: Bulk creates multiple products via file upload (Admin only).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Products created successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
router.post("/bulk", protect_1.default, (0, authorizeRole_1.default)("ADMIN", "SUPERADMIN"), upload_1.default.single("file"), productController.bulkCreateProducts);
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     description: Deletes a specific product by its ID (Admin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
router.delete("/:id", protect_1.default, (0, authorizeRole_1.default)("ADMIN", "SUPERADMIN"), productController.deleteProduct);
exports.default = router;
