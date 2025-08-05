"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("./AppError"));
class InternalServerError extends AppError_1.default {
    constructor(message = "Internal server error") {
        super(500, message, false);
    }
}
exports.default = InternalServerError;
