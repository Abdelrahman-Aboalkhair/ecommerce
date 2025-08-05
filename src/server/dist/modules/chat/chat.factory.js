"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeChatController = void 0;
const chat_controller_1 = require("./chat.controller");
const chat_repository_1 = require("./chat.repository");
const chat_service_1 = require("./chat.service");
const makeChatController = (io) => {
    const repo = new chat_repository_1.ChatRepository();
    const service = new chat_service_1.ChatService(repo, io);
    const controller = new chat_controller_1.ChatController(service);
    return controller;
};
exports.makeChatController = makeChatController;
