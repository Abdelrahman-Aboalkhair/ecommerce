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
exports.PaymentService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class PaymentService {
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    getUserPayments(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payments = yield this.paymentRepository.findPaymentsByUserId(userId);
            if (!payments || payments.length === 0) {
                throw new AppError_1.default(404, "No payments found for this user");
            }
            return payments;
        });
    }
    getPaymentDetails(paymentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.paymentRepository.findPaymentById(paymentId);
            if (!payment) {
                throw new AppError_1.default(404, "Payment not found");
            }
            if (payment.userId !== userId) {
                throw new AppError_1.default(403, "You are not authorized to view this payment");
            }
            return payment;
        });
    }
    deletePayment(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.paymentRepository.findPaymentById(paymentId);
            if (!payment) {
                throw new AppError_1.default(404, "Payment not found");
            }
            return this.paymentRepository.deletePayment(paymentId);
        });
    }
}
exports.PaymentService = PaymentService;
