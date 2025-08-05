"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureChatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const chat_factory_1 = require("./chat.factory");
const protect_1 = __importDefault(require("@/shared/middlewares/protect"));
const upload_1 = __importDefault(require("@/shared/middlewares/upload"));
const configureChatRoutes = (io) => {
    const router = express_1.default.Router();
    const chatController = (0, chat_factory_1.makeChatController)(io);
    /**
     * @swagger
     * /chats:
     *   get:
     *     summary: Get all chats
     *     description: Retrieves all chats for the authenticated user.
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: A list of all chats.
     */
    router.get("/", protect_1.default, chatController.getAllChats);
    /**
     * @swagger
     * /chats:
     *   post:
     *     summary: Create a new chat
     *     description: Creates a new chat for the authenticated user.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               participantIds:
     *                 type: array
     *                 items:
     *                   type: string
     *               topic:
     *                 type: string
     *     responses:
     *       201:
     *         description: Chat created successfully.
     */
    router.post("/", protect_1.default, chatController.createChat);
    /**
     * @swagger
     * /chats/user:
     *   get:
     *     summary: Get user's chats
     *     description: Retrieves all chats associated with the authenticated user.
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: A list of the user's chats.
     */
    router.get("/user", protect_1.default, chatController.getUserChats);
    /**
     * @swagger
     * /chats/{id}:
     *   get:
     *     summary: Get a specific chat by ID
     *     description: Retrieves details of a specific chat by its ID.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the chat to retrieve.
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Chat details.
     *       404:
     *         description: Chat not found.
     */
    router.get("/:id", protect_1.default, chatController.getChat);
    /**
     * @swagger
     * /chats/{chatId}/message:
     *   post:
     *     summary: Send a message in chat
     *     description: Sends a message in a specified chat, with optional file attachment.
     *     parameters:
     *       - in: path
     *         name: chatId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the chat to send the message to.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               message:
     *                 type: string
     *               file:
     *                 type: string
     *                 format: binary
     *     responses:
     *       200:
     *         description: Message sent successfully.
     */
    router.post("/:chatId/message", protect_1.default, upload_1.default.single("file"), chatController.sendMessage);
    /**
     * @swagger
     * /chats/{chatId}/status:
     *   patch:
     *     summary: Update chat status
     *     description: Updates the status of a specific chat (e.g., read/unread).
     *     parameters:
     *       - in: path
     *         name: chatId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the chat to update.
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Chat status updated successfully.
     *       404:
     *         description: Chat not found.
     */
    router.patch("/:chatId/status", protect_1.default, chatController.updateChatStatus);
    return router;
};
exports.configureChatRoutes = configureChatRoutes;
