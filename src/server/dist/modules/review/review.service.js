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
exports.ReviewService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class ReviewService {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    createReview(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
                throw new AppError_1.default(400, "Rating must be an integer between 1 and 5");
            }
            const product = yield database_config_1.default.product.findUnique({
                where: { id: data.productId },
            });
            if (!product) {
                throw new AppError_1.default(404, "Product not found");
            }
            const existingReview = yield this.reviewRepository.findReviewByUserAndProduct(userId, data.productId);
            if (existingReview) {
                throw new AppError_1.default(400, "You have already reviewed this product");
            }
            const review = yield this.reviewRepository.createReview({
                userId,
                productId: data.productId,
                rating: data.rating,
                comment: data.comment,
            });
            yield this.reviewRepository.updateProductRating(data.productId);
            return review;
        });
    }
    getReviewsByProductId(productId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(query.page) || 1;
            const limit = Number(query.limit) || 10;
            const skip = (page - 1) * limit;
            const reviews = yield this.reviewRepository.findReviewsByProductId(productId, {
                skip,
                take: limit,
            });
            const total = yield database_config_1.default.review.count({ where: { productId } });
            const totalPages = Math.ceil(total / limit);
            return {
                reviews,
                total,
                totalPages,
                currentPage: page,
                resultsPerPage: limit,
            };
        });
    }
    deleteReview(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield this.reviewRepository.findReviewById(id);
            if (!review) {
                throw new AppError_1.default(404, "Review not found");
            }
            yield this.reviewRepository.deleteReview(id);
            yield this.reviewRepository.updateProductRating(review.productId);
            return { message: "Review deleted successfully" };
        });
    }
}
exports.ReviewService = ReviewService;
