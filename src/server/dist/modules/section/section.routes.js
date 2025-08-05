"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const section_factory_1 = require("./section.factory");
const upload_1 = __importDefault(require("@/shared/middlewares/upload"));
const router = (0, express_1.Router)();
const sectionController = (0, section_factory_1.makeSectionController)();
/**
 * @swagger
 * /sections:
 *   get:
 *     summary: Get all sections
 *     description: Retrieves all sections of the application.
 *     responses:
 *       200:
 *         description: A list of all sections.
 */
router.get("/", sectionController.getAllSections);
/**
 * @swagger
 * /sections/hero:
 *   get:
 *     summary: Get the hero section
 *     description: Retrieves the hero section of the application.
 *     responses:
 *       200:
 *         description: Hero section details.
 */
router.get("/hero", sectionController.findHero);
/**
 * @swagger
 * /sections/promo:
 *   get:
 *     summary: Get the promotional section
 *     description: Retrieves the promotional section of the application.
 *     responses:
 *       200:
 *         description: Promo section details.
 */
router.get("/promo", sectionController.findPromo);
/**
 * @swagger
 * /sections/benefits:
 *   get:
 *     summary: Get the benefits section
 *     description: Retrieves the benefits section of the application.
 *     responses:
 *       200:
 *         description: Benefits section details.
 */
router.get("/benefits", sectionController.findBenefits);
/**
 * @swagger
 * /sections/arrivals:
 *   get:
 *     summary: Get the arrivals section
 *     description: Retrieves the arrivals section of the application.
 *     responses:
 *       200:
 *         description: Arrivals section details.
 */
router.get("/arrivals", sectionController.findArrivals);
/**
 * @swagger
 * /sections:
 *   post:
 *     summary: Create a new section
 *     description: Creates a new section. Uploads up to 5 images for the section.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: List of images to be uploaded for the section.
 *     responses:
 *       201:
 *         description: Section created successfully.
 *       400:
 *         description: Invalid input data.
 */
router.post("/", upload_1.default.array("images", 5), sectionController.createSection);
/**
 * @swagger
 * /sections/{type}:
 *   put:
 *     summary: Update an existing section
 *     description: Updates a section based on the type provided.
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of the section to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the section.
 *               content:
 *                 type: string
 *                 description: The content of the section.
 *     responses:
 *       200:
 *         description: Section updated successfully.
 *       400:
 *         description: Invalid input data.
 */
router.put("/:type", sectionController.updateSection);
/**
 * @swagger
 * /sections/{type}:
 *   delete:
 *     summary: Delete a section
 *     description: Deletes a section based on the type provided.
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of the section to be deleted.
 *     responses:
 *       200:
 *         description: Section deleted successfully.
 *       404:
 *         description: Section not found.
 */
router.delete("/:type", sectionController.deleteSection);
exports.default = router;
