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
exports.ChatRepository = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class ChatRepository {
    constructor() { }
    createChat(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.chat.create({
                data: {
                    userId,
                    status: "OPEN",
                },
                include: { user: true, messages: { include: { sender: true } } },
            });
        });
    }
    finduserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.chat.findMany({
                where: { userId },
                include: { user: true, messages: { include: { sender: true } } },
                orderBy: { updatedAt: "desc" },
            });
        });
    }
    findChatById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.chat.findUnique({
                where: { id },
                include: { user: true, messages: { include: { sender: true } } },
            });
        });
    }
    findChatsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.chat.findMany({
                where: { userId },
                include: { user: true, messages: { include: { sender: true } } },
                orderBy: { updatedAt: "desc" },
            });
        });
    }
    findAllChats(status) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.chat.findMany({
                where: status ? { status } : {},
                include: { messages: { include: { sender: true } } },
            });
        });
    }
    createMessage(chatId_1, senderId_1, content_1) {
        return __awaiter(this, arguments, void 0, function* (chatId, senderId, content, type = "TEXT", url) {
            return database_config_1.default.chatMessage.create({
                data: {
                    chatId,
                    senderId,
                    content,
                    type,
                    url,
                    createdAt: new Date(),
                },
                include: { sender: true },
            });
        });
    }
    updateChatStatus(chatId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.chat.update({
                where: { id: chatId },
                data: { status },
                include: { user: true, messages: { include: { sender: true } } },
            });
        });
    }
}
exports.ChatRepository = ChatRepository;
