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
exports.WebhookController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const logs_factory_1 = require("../logs/logs.factory");
const stripe_1 = __importDefault(require("@/infra/payment/stripe"));
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class WebhookController {
    constructor(webhookService) {
        this.webhookService = webhookService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.handleWebhook = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const sig = req.headers["stripe-signature"];
            if (!sig)
                throw new AppError_1.default(400, "No Stripe signature");
            let event;
            event = stripe_1.default.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
            if (event.type === "checkout.session.completed") {
                const session = event.data.object;
                const { order, payment, shipment, address } = yield this.webhookService.handleCheckoutCompletion(session);
            }
            (0, sendResponse_1.default)(res, 200, { message: "Webhook received successfully" });
        }));
    }
}
exports.WebhookController = WebhookController;
