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
exports.WebhookService = void 0;
const client_1 = require("@prisma/client");
const stripe_1 = __importDefault(require("@/infra/payment/stripe"));
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const redis_1 = __importDefault(require("@/infra/cache/redis"));
const logs_factory_1 = require("../logs/logs.factory");
const cart_service_1 = require("../cart/cart.service");
const cart_repository_1 = require("../cart/cart.repository");
const prisma = new client_1.PrismaClient();
class WebhookService {
    constructor() {
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.repo = new cart_repository_1.CartRepository();
        this.cartService = new cart_service_1.CartService(this.repo);
    }
    calculateOrderAmount(cart) {
        return __awaiter(this, void 0, void 0, function* () {
            return cart.cartItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
        });
    }
    handleCheckoutCompletion(session) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const fullSession = yield stripe_1.default.checkout.sessions.retrieve(session.id, {
                expand: ["customer_details", "line_items"],
            });
            const existingOrder = yield prisma.order.findFirst({
                where: { id: fullSession.id },
            });
            if (existingOrder) {
                this.logsService.info("Webhook - Duplicate event ignored", {
                    sessionId: session.id,
                });
                return {
                    order: existingOrder,
                    payment: null,
                    transaction: null,
                    shipment: null,
                    address: null,
                };
            }
            const userId = (_a = fullSession === null || fullSession === void 0 ? void 0 : fullSession.metadata) === null || _a === void 0 ? void 0 : _a.userId;
            const cartId = (_b = fullSession === null || fullSession === void 0 ? void 0 : fullSession.metadata) === null || _b === void 0 ? void 0 : _b.cartId;
            if (!userId || !cartId) {
                throw new AppError_1.default(400, "Missing userId or cartId in session metadata");
            }
            const cart = yield prisma.cart.findUnique({
                where: { id: cartId },
                include: { cartItems: { include: { variant: { include: { product: true } } } } },
            });
            if (!cart || cart.cartItems.length === 0) {
                throw new AppError_1.default(400, "Cart is empty or not found");
            }
            const amount = yield this.calculateOrderAmount(cart);
            if (Math.abs(amount - ((_c = fullSession.amount_total) !== null && _c !== void 0 ? _c : 0) / 100) > 0.01) {
                throw new AppError_1.default(400, "Amount mismatch between cart and session");
            }
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                // Validate stock
                for (const item of cart.cartItems) {
                    if (item.variant.stock < item.quantity) {
                        throw new AppError_1.default(400, `Insufficient stock for variant ${item.variant.sku}: only ${item.variant.stock} available`);
                    }
                }
                // Create Order and OrderItems
                const order = yield tx.order.create({
                    data: {
                        id: fullSession.id,
                        userId,
                        amount,
                        orderItems: {
                            create: cart.cartItems.map((item) => ({
                                variantId: item.variantId,
                                quantity: item.quantity,
                                price: item.variant.price,
                            })),
                        },
                    },
                });
                // Create Address
                let address;
                const customerAddress = (_a = fullSession.customer_details) === null || _a === void 0 ? void 0 : _a.address;
                if (customerAddress) {
                    address = yield tx.address.create({
                        data: {
                            orderId: order.id,
                            userId,
                            city: customerAddress.city || "N/A",
                            state: customerAddress.state || "N/A",
                            country: customerAddress.country || "N/A",
                            zip: customerAddress.postal_code || "N/A",
                            street: customerAddress.line1 || "N/A",
                        },
                    });
                }
                // Create Payment
                const payment = yield tx.payment.create({
                    data: {
                        orderId: order.id,
                        userId,
                        method: ((_b = fullSession.payment_method_types) === null || _b === void 0 ? void 0 : _b[0]) || "unknown",
                        amount,
                        status: client_1.PAYMENT_STATUS.PAID,
                    },
                });
                // Create Transaction
                const transaction = yield tx.transaction.create({
                    data: {
                        orderId: order.id,
                        status: client_1.TRANSACTION_STATUS.PENDING,
                        transactionDate: new Date(),
                    },
                });
                // Create Shipment
                const shipment = yield tx.shipment.create({
                    data: {
                        orderId: order.id,
                        carrier: "Carrier_" + Math.random().toString(36).substring(2, 10),
                        trackingNumber: Math.random().toString(36).substring(2),
                        shippedDate: new Date(),
                        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    },
                });
                // Update Variant Stock and Product Sales Count
                for (const item of cart.cartItems) {
                    const variant = yield tx.productVariant.findUnique({
                        where: { id: item.variantId },
                        select: { stock: true, product: { select: { id: true, salesCount: true } } },
                    });
                    if (!variant) {
                        throw new AppError_1.default(404, `Variant not found: ${item.variantId}`);
                    }
                    yield tx.productVariant.update({
                        where: { id: item.variantId },
                        data: { stock: variant.stock - item.quantity },
                    });
                    yield tx.product.update({
                        where: { id: variant.product.id },
                        data: { salesCount: variant.product.salesCount + item.quantity },
                    });
                }
                // Clear the Cart
                yield tx.cartItem.deleteMany({ where: { cartId: cart.id } });
                yield tx.cart.update({
                    where: { id: cart.id },
                    data: { status: client_1.CART_STATUS.CONVERTED },
                });
                return { order, payment, transaction, shipment, address };
            }));
            // Post-transaction actions
            yield redis_1.default.del("dashboard:year-range");
            const keys = yield redis_1.default.keys("dashboard:stats:*");
            if (keys.length > 0)
                yield redis_1.default.del(keys);
            this.cartService.logCartEvent(cart.id, "CHECKOUT_COMPLETED", userId);
            this.logsService.info("Webhook - Order processed successfully", {
                userId,
                orderId: result.order.id,
                amount,
            });
            return result;
        });
    }
}
exports.WebhookService = WebhookService;
