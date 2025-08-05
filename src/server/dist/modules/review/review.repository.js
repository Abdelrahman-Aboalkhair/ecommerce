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
exports.ReviewRepository = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class ReviewRepository {
    createReview(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.review.create({ data });
        });
    }
    findReviewsByProductId(productId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { skip = 0, take = 10 } = params;
            return database_config_1.default.review.findMany({
                where: { productId },
                include: { user: { select: { name: true, avatar: true } } },
                orderBy: { createdAt: "desc" },
                skip,
                take,
            });
        });
    }
    findReviewById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.review.findUnique({
                where: { id },
                include: { user: { select: { name: true } } },
            });
        });
    }
    findReviewByUserAndProduct(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.review.findFirst({
                where: { userId, productId },
            });
        });
    }
    deleteReview(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.review.delete({
                where: { id },
            });
        });
    }
    updateProductRating(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviews = yield database_config_1.default.review.findMany({
                where: { productId },
                select: { rating: true },
            });
            const reviewCount = reviews.length;
            const averageRating = reviewCount > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
                : 0;
            return database_config_1.default.product.update({
                where: { id: productId },
                data: { averageRating, reviewCount },
            });
        });
    }
}
exports.ReviewRepository = ReviewRepository;
