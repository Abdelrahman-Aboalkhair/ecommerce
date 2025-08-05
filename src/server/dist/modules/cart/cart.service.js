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
exports.CartService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class CartService {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    getOrCreateCart(userId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let cart;
            if (userId) {
                cart = yield this.cartRepository.getCartByUserId(userId);
                if (!cart) {
                    cart = yield this.cartRepository.createCart({ userId });
                }
            }
            else if (sessionId) {
                cart = yield this.cartRepository.getCartBySessionId(sessionId);
                if (!cart) {
                    cart = yield this.cartRepository.createCart({ sessionId });
                }
            }
            else {
                throw new AppError_1.default(400, "User ID or Session ID is required");
            }
            return cart;
        });
    }
    logCartEvent(cartId, eventType, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_config_1.default.cartEvent.create({
                data: {
                    userId,
                    cartId,
                    eventType,
                },
            });
        });
    }
    getAbandonedCartMetrics(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartEvents = yield database_config_1.default.cartEvent.findMany({
                where: {
                    timestamp: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                include: {
                    cart: {
                        include: { cartItems: { include: { variant: true } } },
                    },
                    user: true,
                },
            });
            const cartEventsByCartId = cartEvents.reduce((acc, event) => {
                if (!acc[event.cartId])
                    acc[event.cartId] = [];
                acc[event.cartId].push(event);
                return acc;
            }, {});
            let totalCarts = 0;
            let totalAbandonedCarts = 0;
            let potentialRevenueLost = 0;
            for (const cartId in cartEventsByCartId) {
                const events = cartEventsByCartId[cartId];
                const hasAddToCart = events.some((e) => e.eventType === "ADD");
                const hasCheckoutCompleted = events.some((e) => e.eventType === "CHECKOUT_COMPLETED");
                const cart = events[0].cart;
                if (!cart || !cart.cartItems || cart.cartItems.length === 0)
                    continue;
                totalCarts++;
                if (hasAddToCart && !hasCheckoutCompleted) {
                    const addToCartEvent = events.find((e) => e.eventType === "ADD");
                    const oneHourLater = new Date(addToCartEvent.timestamp.getTime() + 60 * 60 * 1000);
                    const now = new Date();
                    if (now > oneHourLater) {
                        totalAbandonedCarts++;
                        potentialRevenueLost += cart.cartItems.reduce((sum, item) => sum + item.quantity * item.variant.price, 0);
                    }
                }
            }
            const abandonmentRate = totalCarts > 0 ? (totalAbandonedCarts / totalCarts) * 100 : 0;
            return {
                totalAbandonedCarts,
                abandonmentRate,
                potentialRevenueLost,
            };
        });
    }
    getCartCount(userId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield this.getOrCreateCart(userId, sessionId);
            return cart.cartItems.length;
        });
    }
    addToCart(variantId, quantity, userId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (quantity <= 0) {
                throw new AppError_1.default(400, "Quantity must be greater than 0");
            }
            const cart = yield this.getOrCreateCart(userId, sessionId);
            const existingItem = yield this.cartRepository.findCartItem(cart.id, variantId);
            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                const updatedItem = yield this.cartRepository.updateCartItemQuantity(existingItem.id, newQuantity);
                yield this.logCartEvent(cart.id, "ADD", userId);
                return updatedItem;
            }
            const item = yield this.cartRepository.addItemToCart({
                cartId: cart.id,
                variantId,
                quantity,
            });
            yield this.logCartEvent(cart.id, "ADD", userId);
            return item;
        });
    }
    updateCartItemQuantity(itemId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (quantity <= 0) {
                throw new AppError_1.default(400, "Quantity must be greater than 0");
            }
            return this.cartRepository.updateCartItemQuantity(itemId, quantity);
        });
    }
    removeFromCart(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.cartRepository.removeCartItem(itemId);
        });
    }
    mergeCartsOnLogin(sessionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionCart = yield this.cartRepository.getCartBySessionId(sessionId);
            if (!sessionCart)
                return;
            const userCart = yield this.getOrCreateCart(userId);
            yield this.cartRepository.mergeCarts(sessionCart.id, userCart.id);
        });
    }
}
exports.CartService = CartService;
