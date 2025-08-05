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
exports.ReviewController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const logs_factory_1 = require("../logs/logs.factory");
class ReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.createReview = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = req.user.id;
            const { productId, rating, comment } = req.body;
            const review = yield this.reviewService.createReview(userId, {
                productId,
                rating,
                comment,
            });
            (0, sendResponse_1.default)(res, 201, {
                data: review,
                message: "Review created successfully",
            });
            const start = Date.now();
            const end = Date.now();
            this.logsService.info("Review created", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
                timePeriod: end - start,
            });
        }));
        this.getReviewsByProductId = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.params;
            const { page, limit } = req.query;
            const result = yield this.reviewService.getReviewsByProductId(productId, {
                page: Number(page),
                limit: Number(limit),
            });
            console.log("reviews result => ", result);
            (0, sendResponse_1.default)(res, 200, {
                data: result,
                message: "Reviews fetched successfully",
            });
        }));
        this.deleteReview = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id } = req.params;
            const userId = req.user.id;
            const result = yield this.reviewService.deleteReview(id, userId);
            (0, sendResponse_1.default)(res, 200, result);
            const start = Date.now();
            const end = Date.now();
            this.logsService.info("Review deleted", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
                timePeriod: end - start,
            });
        }));
    }
}
exports.ReviewController = ReviewController;
