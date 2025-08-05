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
exports.PaymentController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const logs_factory_1 = require("../logs/logs.factory");
class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.getUserPayments = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new AppError_1.default(400, "User not found");
            }
            const payments = yield this.paymentService.getUserPayments(userId);
            (0, sendResponse_1.default)(res, 200, {
                data: payments,
                message: "Payments retrieved successfully",
            });
        }));
        this.getPaymentDetails = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { paymentId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new AppError_1.default(400, "User not found");
            }
            const payment = yield this.paymentService.getPaymentDetails(paymentId, userId);
            (0, sendResponse_1.default)(res, 200, {
                data: payment,
                message: "Payment retrieved successfully",
            });
        }));
        this.deletePayment = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { paymentId } = req.params;
            yield this.paymentService.deletePayment(paymentId);
            (0, sendResponse_1.default)(res, 200, { message: "Payment deleted successfully" });
            const start = Date.now();
            const end = Date.now();
            this.logsService.info("Payment deleted", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
                timePeriod: end - start,
            });
        }));
    }
}
exports.PaymentController = PaymentController;
