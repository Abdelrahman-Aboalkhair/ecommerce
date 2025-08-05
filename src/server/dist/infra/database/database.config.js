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
exports.connectDB = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient().$extends({
    query: {
        user: {
            create(_a) {
                return __awaiter(this, arguments, void 0, function* ({ args, query }) {
                    if (args.data.password && typeof args.data.password === "string") {
                        const hashedPassword = yield bcryptjs_1.default.hash(args.data.password, 10);
                        args.data.password = hashedPassword;
                    }
                    return query(args);
                });
            },
            update(_a) {
                return __awaiter(this, arguments, void 0, function* ({ args, query }) {
                    if (args.data.password && typeof args.data.password === "string") {
                        const hashedPassword = yield bcryptjs_1.default.hash(args.data.password, 10);
                        args.data.password = hashedPassword;
                    }
                    return query(args);
                });
            },
        },
    },
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$connect();
        console.log("Neon Database connected successfully.");
    }
    catch (error) {
        console.log(error);
    }
});
exports.connectDB = connectDB;
exports.default = prisma;
