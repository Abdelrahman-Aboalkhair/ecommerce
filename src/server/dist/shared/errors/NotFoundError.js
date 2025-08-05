"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("./AppError"));
class NotFoundError extends AppError_1.default {
    constructor(resource = "Resource") {
        super(404, `${resource} not found`);
    }
}
exports.default = NotFoundError;
