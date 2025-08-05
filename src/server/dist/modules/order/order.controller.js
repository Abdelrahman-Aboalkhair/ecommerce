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
exports.OrderController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
        this.getAllOrders = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orderService.getAllOrders();
            (0, sendResponse_1.default)(res, 200, {
                data: { orders },
                message: "Orders retrieved successfully",
            });
        }));
        this.getUserOrders = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new AppError_1.default(400, "User not found");
            }
            const orders = yield this.orderService.getUserOrders(userId);
            (0, sendResponse_1.default)(res, 200, {
                data: { orders },
                message: "Orders retrieved successfully",
            });
        }));
        this.getOrderDetails = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { orderId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new AppError_1.default(400, "User not found");
            }
            const order = yield this.orderService.getOrderDetails(orderId, userId);
            (0, sendResponse_1.default)(res, 200, {
                data: { order },
                message: "Order details retrieved successfully",
            });
        }));
        this.createOrder = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { cartId } = req.body;
            if (!userId) {
                throw new AppError_1.default(400, "User not found");
            }
            if (!cartId) {
                throw new AppError_1.default(400, "Cart ID is required");
            }
            const order = yield this.orderService.createOrderFromCart(userId, cartId);
            (0, sendResponse_1.default)(res, 201, {
                data: { order },
                message: "Order created successfully",
            });
        }));
    }
}
exports.OrderController = OrderController;
