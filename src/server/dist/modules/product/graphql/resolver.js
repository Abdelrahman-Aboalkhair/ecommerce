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
exports.productResolvers = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
exports.productResolvers = {
    Query: {
        products: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { first = 10, skip = 0, filters = {}, }, context) {
            const where = {};
            // Search filter
            if (filters.search) {
                where.OR = [
                    { name: { contains: filters.search, mode: "insensitive" } },
                    { description: { contains: filters.search, mode: "insensitive" } },
                ];
            }
            // Flag filters
            if (filters.isNew !== undefined)
                where.isNew = filters.isNew;
            if (filters.isFeatured !== undefined)
                where.isFeatured = filters.isFeatured;
            if (filters.isTrending !== undefined)
                where.isTrending = filters.isTrending;
            if (filters.isBestSeller !== undefined)
                where.isBestSeller = filters.isBestSeller;
            // ✅ OR logic for multiple flags
            if (filters.flags && filters.flags.length > 0) {
                const flagConditions = filters.flags.map((flag) => ({ [flag]: true }));
                if (!where.OR)
                    where.OR = [];
                where.OR = [...where.OR, ...flagConditions];
            }
            // Category filter
            if (filters.categoryId) {
                where.categoryId = filters.categoryId;
            }
            // Price filter (based on variants)
            if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
                where.variants = {
                    some: {
                        price: Object.assign(Object.assign({}, (filters.minPrice !== undefined && { gte: filters.minPrice })), (filters.maxPrice !== undefined && { lte: filters.maxPrice })),
                    },
                };
            }
            const totalCount = yield context.prisma.product.count({ where });
            const products = yield context.prisma.product.findMany({
                where,
                take: first,
                skip,
                include: {
                    category: true,
                    variants: true,
                    reviews: true,
                },
            });
            return {
                products,
                hasMore: skip + products.length < totalCount,
                totalCount,
            };
        }),
        product: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { slug }, context) {
            const product = yield context.prisma.product.findUnique({
                where: { slug },
                include: {
                    category: true,
                    variants: {
                        include: {
                            attributes: {
                                include: {
                                    attribute: true,
                                    value: true,
                                },
                            },
                        },
                    },
                    reviews: true,
                },
            });
            if (!product) {
                throw new AppError_1.default(404, "Product not found");
            }
            return product;
        }),
        newProducts: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { first = 10, skip = 0 }, context) {
            const totalCount = yield context.prisma.product.count({
                where: { isNew: true },
            });
            const products = yield context.prisma.product.findMany({
                where: { isNew: true },
                take: first,
                skip,
                include: {
                    category: true,
                    variants: true,
                    reviews: true,
                },
            });
            return {
                products,
                hasMore: skip + products.length < totalCount,
                totalCount,
            };
        }),
        featuredProducts: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { first = 10, skip = 0 }, context) {
            const totalCount = yield context.prisma.product.count({
                where: { isFeatured: true },
            });
            const products = yield context.prisma.product.findMany({
                where: { isFeatured: true },
                take: first,
                skip,
                include: {
                    category: true,
                    variants: true,
                    reviews: true,
                },
            });
            return {
                products,
                hasMore: skip + products.length < totalCount,
                totalCount,
            };
        }),
        trendingProducts: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { first = 10, skip = 0 }, context) {
            const totalCount = yield context.prisma.product.count({
                where: { isTrending: true },
            });
            const products = yield context.prisma.product.findMany({
                where: { isTrending: true },
                take: first,
                skip,
                include: {
                    category: true,
                    variants: true,
                    reviews: true,
                },
            });
            return {
                products,
                hasMore: skip + products.length < totalCount,
                totalCount,
            };
        }),
        bestSellerProducts: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { first = 10, skip = 0 }, context) {
            const totalCount = yield context.prisma.product.count({
                where: { isBestSeller: true },
            });
            const products = yield context.prisma.product.findMany({
                where: { isBestSeller: true },
                take: first,
                skip,
                include: {
                    category: true,
                    variants: true,
                    reviews: true,
                },
            });
            return {
                products,
                hasMore: skip + products.length < totalCount,
                totalCount,
            };
        }),
        categories: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            return context.prisma.category.findMany({
                include: {
                    products: {
                        include: {
                            variants: true,
                        },
                    },
                },
            });
        }),
    },
    Product: {
        reviews: (parent, _, context) => {
            return context.prisma.review.findMany({
                where: { productId: parent.id },
                include: {
                    user: true,
                },
            });
        },
    },
};
