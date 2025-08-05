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
exports.CartRepository = void 0;
const client_1 = require("@prisma/client");
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class CartRepository {
    getCartByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.cart.findFirst({
                where: { userId },
                include: { cartItems: { include: { variant: { include: { product: true } } } } },
            });
        });
    }
    getCartBySessionId(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.cart.findUnique({
                where: { sessionId },
                include: { cartItems: { include: { variant: { include: { product: true } } } } },
            });
        });
    }
    createCart(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.cart.create({
                data,
                include: {
                    cartItems: true,
                },
            });
        });
    }
    findCartItem(cartId, variantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.cartItem.findFirst({
                where: { cartId, variantId },
            });
        });
    }
    addItemToCart(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate stock
                const variant = yield database_config_1.default.productVariant.findUnique({
                    where: { id: data.variantId },
                    select: { stock: true },
                });
                if (!variant) {
                    throw new Error("Variant not found");
                }
                if (variant.stock < data.quantity) {
                    throw new Error(`Insufficient stock: only ${variant.stock} available`);
                }
                return yield database_config_1.default.cartItem.create({ data });
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2002") {
                    throw new Error("Item already exists in cart");
                }
                throw error;
            }
        });
    }
    updateCartItemQuantity(itemId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate stock
            const cartItem = yield database_config_1.default.cartItem.findUnique({
                where: { id: itemId },
                include: { variant: true },
            });
            if (!cartItem) {
                throw new Error("Cart item not found");
            }
            if (cartItem.variant.stock < quantity) {
                throw new Error(`Insufficient stock: only ${cartItem.variant.stock} available`);
            }
            return database_config_1.default.cartItem.update({
                where: { id: itemId },
                data: { quantity },
            });
        });
    }
    removeCartItem(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.cartItem.delete({ where: { id: itemId } });
        });
    }
    mergeCarts(sessionCartId, userCartId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionItems = yield database_config_1.default.cartItem.findMany({
                where: { cartId: sessionCartId },
                include: { variant: true },
            });
            for (const item of sessionItems) {
                const existingItem = yield database_config_1.default.cartItem.findFirst({
                    where: { cartId: userCartId, variantId: item.variantId },
                });
                if (existingItem) {
                    const newQuantity = existingItem.quantity + item.quantity;
                    if (item.variant.stock < newQuantity) {
                        throw new Error(`Insufficient stock for variant ${item.variantId}: only ${item.variant.stock} available`);
                    }
                    yield database_config_1.default.cartItem.update({
                        where: { id: existingItem.id },
                        data: { quantity: newQuantity },
                    });
                }
                else {
                    if (item.variant.stock < item.quantity) {
                        throw new Error(`Insufficient stock for variant ${item.variantId}: only ${item.variant.stock} available`);
                    }
                    yield database_config_1.default.cartItem.create({
                        data: {
                            cartId: userCartId,
                            variantId: item.variantId,
                            quantity: item.quantity,
                        },
                    });
                }
            }
            yield database_config_1.default.cart.delete({ where: { id: sessionCartId } });
        });
    }
    deleteCart(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.cart.delete({ where: { id } });
        });
    }
    clearCart(userId, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = tx || database_config_1.default;
            const cart = yield client.cart.findFirst({
                where: { userId },
            });
            console.log("found cart to be cleared => ", cart);
            if (!cart) {
                return;
            }
            return client.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        });
    }
}
exports.CartRepository = CartRepository;
