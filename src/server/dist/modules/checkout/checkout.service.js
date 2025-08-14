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
exports.CheckoutService = void 0;
const stripe_1 = __importDefault(require("@/infra/payment/stripe"));
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";
function safeImage(images = []) {
    return (images === null || images === void 0 ? void 0 : images[0]) || PLACEHOLDER_IMAGE;
}
function validImage(url) {
    return url.length <= 2048 ? url : PLACEHOLDER_IMAGE;
}
class CheckoutService {
    constructor() { }
    createStripeSession(cart, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate stock for all cart items
            for (const item of cart.cartItems) {
                if (item.variant.stock < item.quantity) {
                    throw new AppError_1.default(400, `Insufficient stock for variant ${item.variant.sku}: only ${item.variant.stock} available`);
                }
            }
            const lineItems = cart.cartItems.map((item) => {
                const imageUrl = validImage(safeImage(item.variant.product.images));
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `${item.variant.product.name} (${item.variant.sku})`,
                            images: [imageUrl],
                            metadata: { variantId: item.variantId },
                        },
                        unit_amount: Math.round(item.variant.price * 100),
                    },
                    quantity: item.quantity,
                };
            });
            const isProduction = process.env.NODE_ENV === "production";
            const clientUrl = isProduction
                ? process.env.CLIENT_URL_PROD
                : process.env.CLIENT_URL_DEV;
            const session = yield stripe_1.default.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: lineItems,
                billing_address_collection: "required",
                shipping_address_collection: {
                    allowed_countries: ["US", "CA", "MX", "EG"],
                },
                mode: "payment",
                success_url: `${clientUrl}/orders`,
                cancel_url: `${clientUrl}/cancel`,
                metadata: { userId, cartId: cart.id },
            });
            return session;
        });
    }
}
exports.CheckoutService = CheckoutService;
