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
const AppError_1 = __importDefault(require("./AppError"));
const logger_1 = __importDefault(require("@/infra/winston/logger"));
const logs_factory_1 = require("@/modules/logs/logs.factory");
const logsService = (0, logs_factory_1.makeLogsService)();
const errorHandlers = {
    ValidationError: (err) => new AppError_1.default(400, Object.values(err.errors || {})
        .map((val) => val.message)
        .join(", ")),
    11000: () => new AppError_1.default(400, "Duplicate field value entered"),
    CastError: (err) => new AppError_1.default(400, `Invalid ${err.path}: ${err.value}`),
    TokenExpiredError: () => new AppError_1.default(401, "Your session has expired, please login again."),
    Joi: (err) => new AppError_1.default(400, (err.details || []).map((detail) => detail.message).join(", ")),
    PrismaClientKnownRequestError: (err) => {
        switch (err.code) {
            case "P2002":
                return new AppError_1.default(400, "Duplicate field value entered");
            case "P2025":
                return new AppError_1.default(404, "Record not found");
            default:
                return new AppError_1.default(400, `Prisma error: ${err.message}`);
        }
    },
    PrismaClientValidationError: () => new AppError_1.default(400, "Invalid input. Please check your request data."),
    PrismaClientInitializationError: () => new AppError_1.default(500, "Database initialization error. Please try again later."),
    PrismaClientRustPanicError: () => new AppError_1.default(500, "Unexpected internal server error. Please try again later."),
};
const globalError = (err, req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let error = err instanceof AppError_1.default ? err : new AppError_1.default(500, err.message);
    const isDev = process.env.NODE_ENV === "development";
    const isProd = process.env.NODE_ENV === "production";
    const handler = errorHandlers[err.name] ||
        errorHandlers[err.constructor.name] ||
        ("code" in err ? errorHandlers[err.code || 500] : undefined);
    if (typeof handler === "function") {
        error = handler(err);
    }
    // DEV logging
    if (isDev) {
        console.error("🔴 Error Message:", err.message);
        console.error("🔴 Error Name:", err.name);
        console.error("🔴 Stack Trace:", (_a = err.stack) === null || _a === void 0 ? void 0 : _a.split("\n").slice(0, 5).join("\n"));
        logger_1.default.error(Object.assign({ message: error.message, statusCode: error.statusCode, method: req.method, path: req.originalUrl, stack: error.stack }, (error.details && { details: error.details })));
    }
    // PROD logging
    if (isProd && error.isOperational) {
        logger_1.default.error(`[${req.method}] ${req.originalUrl} - ${error.statusCode} - ${error.message}`);
    }
    const start = Date.now();
    const end = Date.now();
    // 🛠️ Logs Service Integration
    yield logsService.error(`Error: ${error.message}`, {
        statusCode: error.statusCode,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        userId: ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) || null,
        timePeriod: end - start,
    });
    // 📤 Error Response
    res.status(error.statusCode || 500).json(Object.assign(Object.assign({ status: error.statusCode >= 400 && error.statusCode < 500 ? "fail" : "error", message: error.message }, (error.details && { errors: error.details })), (isDev && {
        stack: error.stack,
        error: error,
    })));
});
exports.default = globalError;
