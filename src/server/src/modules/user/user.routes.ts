import { Router } from "express";
import { makeUserController } from "./user.factory";
import protect from "@/shared/middlewares/protect";
import authorizeRole from "@/shared/middlewares/authorizeRole";
import authorizeRoleHierarchy from "@/shared/middlewares/authorizeRoleHierarchy";
import { validateDto } from "@/shared/middlewares/validateDto";
import { UpdateUserDto, UserEmailDto, UserIdDto } from "./user.dto";
import { CreateAdminDto } from "./user.dto";

const router = Router();
const userController = makeUserController();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     description: Retrieves the profile of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The authenticated user's profile.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.get("/me", protect, userController.getMe);

/**
 * @swagger
 * /users/admin:
 *   post:
 *     summary: Create a new admin
 *     description: Creates a new admin user (SuperAdmin only).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Admin's full name.
 *               email:
 *                 type: string
 *                 description: Admin's email address.
 *               password:
 *                 type: string
 *                 description: Admin's password.
 *     responses:
 *       201:
 *         description: Admin created successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
router.post(
  "/admin",
  protect,
  authorizeRole("SUPERADMIN"),
  validateDto(CreateAdminDto),
  userController.createAdmin
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users (Admin or SuperAdmin only).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all users.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
router.get("/", userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieves a user by their ID (Admin or SuperAdmin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 *       404:
 *         description: User not found.
 */
router.get(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  validateDto(UserIdDto),
  userController.getUserById
);

/**
 * @swagger
 * /users/email/{email}:
 *   get:
 *     summary: Get a user by email
 *     description: Retrieves a user by their email (Admin or SuperAdmin only).
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email of the user to retrieve.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 *       404:
 *         description: User not found.
 */
router.get(
  "/email/:email",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  validateDto(UserEmailDto),
  userController.getUserByEmail
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update the authenticated user's profile
 *     description: Updates the profile of the authenticated user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.put(
  "/:id",
  protect,
  authorizeRole("USER"),
  authorizeRoleHierarchy("USER"),
  validateDto(UpdateUserDto),
  userController.updateMe
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by their ID (Admin or SuperAdmin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 *       404:
 *         description: User not found.
 */
router.delete(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  authorizeRoleHierarchy("ADMIN"),
  validateDto(UserIdDto),
  userController.deleteUser
);

export default router;
