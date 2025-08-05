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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
class ChatService {
    constructor(chatRepository, io) {
        this.chatRepository = chatRepository;
        this.io = io;
    }
    createChat(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield this.chatRepository.createChat(userId);
            this.io.to("admin").emit("chatCreated", chat);
            return chat;
        });
    }
    getChat(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield this.chatRepository.findChatById(id);
            if (!chat)
                throw new Error("Chat not found");
            return chat;
        });
    }
    getUserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatRepository.findChatsByUser(userId);
        });
    }
    getAllChats(status) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatRepository.findAllChats(status);
        });
    }
    sendMessage(chatId, content, senderId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield this.chatRepository.findChatById(chatId);
            if (!chat)
                throw new Error("Chat not found");
            let type = "TEXT";
            let url;
            if (file) {
                console.log("File received:", {
                    mimetype: file.mimetype,
                    size: file.size,
                    originalname: file.originalname,
                });
                try {
                    const uploadResult = yield new Promise((resolve, reject) => {
                        const stream = cloudinary_1.v2.uploader.upload_stream({
                            resource_type: file.mimetype.startsWith("image/")
                                ? "image"
                                : "video",
                            folder: "chat_media",
                        }, (error, result) => {
                            if (error)
                                reject(error);
                            else
                                resolve(result);
                        });
                        const bufferStream = new stream_1.Readable();
                        bufferStream.push(file.buffer);
                        bufferStream.push(null);
                        bufferStream.pipe(stream);
                    });
                    console.log("Cloudinary upload result:", uploadResult);
                    type = file.mimetype.startsWith("image/") ? "IMAGE" : "VOICE";
                    url = uploadResult.secure_url;
                }
                catch (error) {
                    console.error("Cloudinary upload failed:", error);
                    throw new Error("Failed to upload file");
                }
            }
            const message = yield this.chatRepository.createMessage(chatId, senderId, content, type, url);
            this.io.to(`chat:${chatId}`).emit("newMessage", message);
            return message;
        });
    }
    updateChatStatus(chatId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield this.chatRepository.updateChatStatus(chatId, status);
            this.io.to("admin").emit("chatStatusUpdated", chat);
            return chat;
        });
    }
}
exports.ChatService = ChatService;
