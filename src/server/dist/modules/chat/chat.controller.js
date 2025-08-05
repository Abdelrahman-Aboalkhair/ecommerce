"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const logs_factory_1 = require("../logs/logs.factory");
class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.getChat = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = req.user;
            const chat = yield this.chatService.getChat(id);
            (0, sendResponse_1.default)(res, 200, {
                data: { chat },
                message: "Chat fetched successfully",
            });
            this.logsService.info("Chat fetched", {
                userId: user.id,
                chatId: id,
            });
        }));
        this.getUserChats = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                throw new Error("User not found");
            }
            const userId = req.user.id;
            console.log("userId => ", userId);
            const chats = yield this.chatService.getUserChats(userId);
            console.log("chats => ", chats);
            (0, sendResponse_1.default)(res, 200, {
                data: { chats },
                message: "Chats fetched successfully",
            });
            this.logsService.info("Chats fetched by user", {
                userId,
                targetUserId: userId,
            });
        }));
        this.getAllChats = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const { status } = req.query;
            const chats = yield this.chatService.getAllChats(status);
            (0, sendResponse_1.default)(res, 200, {
                data: { chats },
                message: "All chats fetched successfully",
            });
            this.logsService.info("All chats fetched", {
                userId: user.id,
            });
        }));
        this.createChat = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                throw new Error("User not found");
            }
            const userId = req.user.id;
            const newChat = yield this.chatService.createChat(userId);
            (0, sendResponse_1.default)(res, 201, {
                data: { chat: newChat },
                message: "Chat created successfully",
            });
            this.logsService.info("Chat created", {
                userId,
            });
        }));
        this.sendMessage = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { chatId, content } = req.body;
            const user = req.user;
            const file = req.file;
            console.log("file => ", file);
            const message = yield this.chatService.sendMessage(chatId, content || null, user.id, file);
            (0, sendResponse_1.default)(res, 200, {
                data: { message },
                message: "Message sent successfully",
            });
            this.logsService.info("Message sent", {
                userId: user.id,
                chatId,
                type: message.type,
            });
        }));
        this.updateChatStatus = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { chatId } = req.params;
            const { status } = req.body;
            const user = req.user;
            const updatedChat = yield this.chatService.updateChatStatus(chatId, status);
            (0, sendResponse_1.default)(res, 200, {
                data: { chat: updatedChat },
                message: "Chat status updated successfully",
            });
            this.logsService.info("Chat status updated", {
                userId: user.id,
                chatId,
                status,
            });
        }));
    }
}
exports.ChatController = ChatController;
