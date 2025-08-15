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
            var _a;
            console.log("🔍 [CART SERVICE] getOrCreateCart called");
            console.log("🔍 [CART SERVICE] userId:", userId);
            console.log("🔍 [CART SERVICE] sessionId:", sessionId);
            let cart;
            if (userId) {
                console.log("🔍 [CART SERVICE] Looking for cart by userId:", userId);
                cart = yield this.cartRepository.getCartByUserId(userId);
                console.log("🔍 [CART SERVICE] Cart found by userId:", cart);
                if (!cart) {
                    console.log("🔍 [CART SERVICE] No cart found by userId, creating new cart");
                    cart = yield this.cartRepository.createCart({ userId });
                    console.log("🔍 [CART SERVICE] New cart created for userId:", cart);
                }
            }
            else if (sessionId) {
                console.log("🔍 [CART SERVICE] Looking for cart by sessionId:", sessionId);
                cart = yield this.cartRepository.getCartBySessionId(sessionId);
                console.log("🔍 [CART SERVICE] Cart found by sessionId:", cart);
                if (!cart) {
                    console.log("🔍 [CART SERVICE] No cart found by sessionId, creating new cart");
                    cart = yield this.cartRepository.createCart({ sessionId });
                    console.log("🔍 [CART SERVICE] New cart created for sessionId:", cart);
                }
            }
            else {
                console.log("🔍 [CART SERVICE] ERROR: Neither userId nor sessionId provided");
                throw new AppError_1.default(400, "User ID or Session ID is required");
            }
            console.log("🔍 [CART SERVICE] Final cart to return:", cart);
            console.log("🔍 [CART SERVICE] Cart ID:", cart === null || cart === void 0 ? void 0 : cart.id);
            console.log("🔍 [CART SERVICE] Cart items count:", (_a = cart === null || cart === void 0 ? void 0 : cart.cartItems) === null || _a === void 0 ? void 0 : _a.length);
            console.log("🔍 [CART SERVICE] Cart items:", cart === null || cart === void 0 ? void 0 : cart.cartItems);
            return cart;
        });
    }
    logCartEvent(cartId, eventType, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("🔍 [CART SERVICE] logCartEvent called");
            console.log("🔍 [CART SERVICE] cartId:", cartId);
            console.log("🔍 [CART SERVICE] eventType:", eventType);
            console.log("🔍 [CART SERVICE] userId:", userId);
            yield database_config_1.default.cartEvent.create({
                data: {
                    userId,
                    cartId,
                    eventType,
                },
            });
            console.log("🔍 [CART SERVICE] Cart event logged successfully");
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
            console.log("🔍 [CART SERVICE] getCartCount called");
            console.log("🔍 [CART SERVICE] userId:", userId);
            console.log("🔍 [CART SERVICE] sessionId:", sessionId);
            const cart = yield this.getOrCreateCart(userId, sessionId);
            const count = cart.cartItems.length;
            console.log("🔍 [CART SERVICE] Cart count calculated:", count);
            console.log("🔍 [CART SERVICE] Cart items:", cart.cartItems);
            return count;
        });
    }
    addToCart(variantId, quantity, userId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("🔍 [CART SERVICE] addToCart called");
            console.log("🔍 [CART SERVICE] variantId:", variantId);
            console.log("🔍 [CART SERVICE] quantity:", quantity);
            console.log("🔍 [CART SERVICE] userId:", userId);
            console.log("🔍 [CART SERVICE] sessionId:", sessionId);
            if (quantity <= 0) {
                console.log("🔍 [CART SERVICE] ERROR: Quantity must be greater than 0");
                throw new AppError_1.default(400, "Quantity must be greater than 0");
            }
            const cart = yield this.getOrCreateCart(userId, sessionId);
            console.log("🔍 [CART SERVICE] Cart retrieved for adding item:", cart);
            console.log("🔍 [CART SERVICE] Cart ID:", cart.id);
            const existingItem = yield this.cartRepository.findCartItem(cart.id, variantId);
            console.log("🔍 [CART SERVICE] Existing item found:", existingItem);
            if (existingItem) {
                console.log("🔍 [CART SERVICE] Updating existing item quantity");
                const newQuantity = existingItem.quantity + quantity;
                console.log("🔍 [CART SERVICE] New quantity:", newQuantity);
                const updatedItem = yield this.cartRepository.updateCartItemQuantity(existingItem.id, newQuantity);
                console.log("🔍 [CART SERVICE] Item updated:", updatedItem);
                yield this.logCartEvent(cart.id, "ADD", userId);
                console.log("🔍 [CART SERVICE] Cart event logged for update");
                return updatedItem;
            }
            console.log("🔍 [CART SERVICE] Creating new cart item");
            const item = yield this.cartRepository.addItemToCart({
                cartId: cart.id,
                variantId,
                quantity,
            });
            console.log("🔍 [CART SERVICE] New item created:", item);
            yield this.logCartEvent(cart.id, "ADD", userId);
            console.log("🔍 [CART SERVICE] Cart event logged for new item");
            return item;
        });
    }
    updateCartItemQuantity(itemId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("🔍 [CART SERVICE] updateCartItemQuantity called");
            console.log("🔍 [CART SERVICE] itemId:", itemId);
            console.log("🔍 [CART SERVICE] quantity:", quantity);
            if (quantity <= 0) {
                console.log("🔍 [CART SERVICE] ERROR: Quantity must be greater than 0");
                throw new AppError_1.default(400, "Quantity must be greater than 0");
            }
            const result = this.cartRepository.updateCartItemQuantity(itemId, quantity);
            console.log("🔍 [CART SERVICE] Update result:", result);
            return result;
        });
    }
    removeFromCart(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("🔍 [CART SERVICE] removeFromCart called");
            console.log("🔍 [CART SERVICE] itemId:", itemId);
            const result = this.cartRepository.removeCartItem(itemId);
            console.log("🔍 [CART SERVICE] Remove result:", result);
            return result;
        });
    }
    mergeCartsOnLogin(sessionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("🔍 [CART SERVICE] mergeCartsOnLogin called");
            console.log("🔍 [CART SERVICE] sessionId:", sessionId);
            console.log("🔍 [CART SERVICE] userId:", userId);
            const sessionCart = yield this.cartRepository.getCartBySessionId(sessionId);
            console.log("🔍 [CART SERVICE] Session cart found:", sessionCart);
            if (!sessionCart) {
                console.log("🔍 [CART SERVICE] No session cart found, nothing to merge");
                return;
            }
            const userCart = yield this.getOrCreateCart(userId);
            console.log("🔍 [CART SERVICE] User cart retrieved:", userCart);
            yield this.cartRepository.mergeCarts(sessionCart.id, userCart.id);
            console.log("🔍 [CART SERVICE] Carts merged successfully");
        });
    }
}
exports.CartService = CartService;
