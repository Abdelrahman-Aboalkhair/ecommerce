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
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_1 = require("@/shared/utils/analytics");
const productPerformance = {
    Query: {
        productPerformance: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { params }, { prisma }) {
            const { timePeriod, year, startDate, endDate, category } = params;
            const { currentStartDate, yearStart, yearEnd } = (0, analytics_1.getDateRange)({
                timePeriod,
                year,
                startDate,
                endDate,
            });
            const orderItems = yield prisma.orderItem.findMany({
                where: {
                    createdAt: Object.assign(Object.assign(Object.assign(Object.assign({}, (currentStartDate && { gte: currentStartDate })), (endDate && { lte: new Date(endDate) })), (yearStart && { gte: yearStart })), (yearEnd && { lte: yearEnd })),
                    // category filter commented out; adjust if needed
                },
                include: { variant: true },
            });
            const productSales = {};
            for (const item of orderItems) {
                const productId = item.variantId;
                if (!productSales[productId]) {
                    productSales[productId] = {
                        id: productId,
                        name: item.variant.sku || "Unknown",
                        quantity: 0,
                        revenue: 0,
                    };
                }
                productSales[productId].quantity += item.quantity;
                productSales[productId].revenue +=
                    item.quantity * (item.variant.price || 0);
            }
            return Object.values(productSales).sort((a, b) => b.quantity - a.quantity);
        }),
    },
};
exports.default = productPerformance;
