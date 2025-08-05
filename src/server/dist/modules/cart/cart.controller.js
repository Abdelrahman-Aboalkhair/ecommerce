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
exports.CartController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const logs_factory_1 = require("../logs/logs.factory");
class CartController {
    constructor(cartService) {
        this.cartService = cartService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.getCart = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const sessionId = req.session.id;
            const cart = yield this.cartService.getOrCreateCart(userId, sessionId);
            (0, sendResponse_1.default)(res, 200, {
                data: { cart },
                message: "Cart fetched successfully",
            });
            this.logsService.info("Cart fetched", {
                userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
                sessionId: req.session.id,
                timePeriod: Date.now() - Date.now(),
            });
        }));
        this.getCartCount = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const sessionId = req.session.id;
            const cartCount = yield this.cartService.getCartCount(userId, sessionId);
            (0, sendResponse_1.default)(res, 200, {
                data: { cartCount },
                message: "Cart count fetched successfully",
            });
        }));
        this.addToCart = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const sessionId = req.session.id;
            const { variantId, quantity } = req.body;
            const item = yield this.cartService.addToCart(variantId, quantity, userId, sessionId);
            (0, sendResponse_1.default)(res, 200, {
                data: { item },
                message: "Item added to cart successfully",
            });
            this.logsService.info("Item added to cart", {
                userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
                sessionId: req.session.id,
                timePeriod: Date.now() - Date.now(),
            });
        }));
        this.updateCartItem = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { itemId } = req.params;
            const { quantity } = req.body;
            const updatedItem = yield this.cartService.updateCartItemQuantity(itemId, quantity);
            (0, sendResponse_1.default)(res, 200, {
                data: { item: updatedItem },
                message: "Item quantity updated successfully",
            });
            this.logsService.info("Item quantity updated", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
                timePeriod: Date.now() - Date.now(),
            });
        }));
        this.removeFromCart = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { itemId } = req.params;
            yield this.cartService.removeFromCart(itemId);
            (0, sendResponse_1.default)(res, 200, { message: "Item removed from cart successfully" });
            this.logsService.info("Item removed from cart", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
                timePeriod: Date.now() - Date.now(),
            });
        }));
        this.mergeCarts = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const sessionId = req.session.id;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            yield this.cartService.mergeCartsOnLogin(sessionId, userId);
            (0, sendResponse_1.default)(res, 200, { message: "Carts merged successfully" });
            this.logsService.info("Carts merged", {
                userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
                sessionId: req.session.id,
                timePeriod: Date.now() - Date.now(),
            });
        }));
    }
}
exports.CartController = CartController;
