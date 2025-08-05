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
exports.OrderRepository = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class OrderRepository {
    findAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.order.findMany({
                orderBy: { orderDate: "desc" },
                include: { orderItems: { include: { variant: { include: { product: true } } } } },
            });
        });
    }
    findOrdersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.order.findMany({
                where: { userId },
                orderBy: { orderDate: "desc" },
                include: { orderItems: { include: { variant: { include: { product: true } } } } },
            });
        });
    }
    findOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.order.findUnique({
                where: { id: orderId },
                include: {
                    orderItems: { include: { variant: { include: { product: true } } } },
                    payment: true,
                    address: true,
                    shipment: true,
                    transaction: true,
                },
            });
        });
    }
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Validate stock for all variants
                for (const item of data.orderItems) {
                    const variant = yield tx.productVariant.findUnique({
                        where: { id: item.variantId },
                        select: { stock: true, product: { select: { id: true, salesCount: true } } },
                    });
                    if (!variant) {
                        throw new Error(`Variant not found: ${item.variantId}`);
                    }
                    if (variant.stock < item.quantity) {
                        throw new Error(`Insufficient stock for variant ${item.variantId}: only ${variant.stock} available`);
                    }
                }
                // Create order
                const order = yield tx.order.create({
                    data: {
                        userId: data.userId,
                        amount: data.amount,
                        orderItems: {
                            create: data.orderItems.map((item) => ({
                                variantId: item.variantId,
                                quantity: item.quantity,
                                price: item.price,
                            })),
                        },
                    },
                });
                // Update stock and sales count
                for (const item of data.orderItems) {
                    const variant = yield tx.productVariant.findUnique({
                        where: { id: item.variantId },
                        select: { stock: true, product: { select: { id: true, salesCount: true } } },
                    });
                    if (variant) {
                        yield tx.productVariant.update({
                            where: { id: item.variantId },
                            data: { stock: variant.stock - item.quantity },
                        });
                        yield tx.product.update({
                            where: { id: variant.product.id },
                            data: { salesCount: variant.product.salesCount + item.quantity },
                        });
                    }
                }
                return order;
            }));
        });
    }
}
exports.OrderRepository = OrderRepository;
