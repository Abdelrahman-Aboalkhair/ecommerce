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
exports.OrderService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class OrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    getAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orderRepository.findAllOrders();
            if (!orders || orders.length === 0) {
                throw new AppError_1.default(404, "No orders found");
            }
            return orders;
        });
    }
    getUserOrders(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orderRepository.findOrdersByUserId(userId);
            if (!orders || orders.length === 0) {
                throw new AppError_1.default(404, "No orders found for this user");
            }
            return orders;
        });
    }
    getOrderDetails(orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderRepository.findOrderById(orderId);
            if (!order) {
                throw new AppError_1.default(404, "Order not found");
            }
            if (order.userId !== userId) {
                throw new AppError_1.default(403, "You are not authorized to view this order");
            }
            return order;
        });
    }
    createOrderFromCart(userId, cartId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield database_config_1.default.cart.findUnique({
                where: { id: cartId },
                include: { cartItems: { include: { variant: { include: { product: true } } } } },
            });
            if (!cart || cart.cartItems.length === 0) {
                throw new AppError_1.default(400, "Cart is empty or not found");
            }
            if (cart.userId !== userId) {
                throw new AppError_1.default(403, "You are not authorized to access this cart");
            }
            const amount = cart.cartItems.reduce((sum, item) => sum + item.quantity * item.variant.price, 0);
            const orderItems = cart.cartItems.map((item) => ({
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.variant.price,
            }));
            return this.orderRepository.createOrder({
                userId,
                amount,
                orderItems,
            });
        });
    }
}
exports.OrderService = OrderService;
