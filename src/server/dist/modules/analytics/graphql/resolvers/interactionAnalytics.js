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
const interactionAnalytics = {
    Query: {
        interactionAnalytics: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { params }, { prisma }) {
            var _c;
            const { timePeriod, year, startDate, endDate } = params;
            const { currentStartDate, yearStart, yearEnd } = (0, analytics_1.getDateRange)({
                timePeriod,
                year,
                startDate,
                endDate,
            });
            const interactions = yield prisma.interaction.findMany({
                where: {
                    createdAt: Object.assign(Object.assign(Object.assign(Object.assign({}, (currentStartDate && { gte: currentStartDate })), (endDate && { lte: new Date(endDate) })), (yearStart && { gte: yearStart })), (yearEnd && { lte: yearEnd })),
                },
                include: { product: true },
            });
            const totalInteractions = interactions.length;
            const byType = {
                views: interactions.filter((i) => i.type.toLowerCase() === "view").length,
                clicks: interactions.filter((i) => i.type.toLowerCase() === "click").length,
                others: interactions.filter((i) => !["view", "click"].includes(i.type.toLowerCase())).length,
            };
            const productViews = {};
            for (const interaction of interactions) {
                if (interaction.type.toLowerCase() === "view" && interaction.productId) {
                    if (!productViews[interaction.productId]) {
                        productViews[interaction.productId] = {
                            name: ((_c = interaction.product) === null || _c === void 0 ? void 0 : _c.name) || "Unknown",
                            count: 0,
                        };
                    }
                    productViews[interaction.productId].count += 1;
                }
            }
            const mostViewedProducts = Object.entries(productViews)
                .map(([productId, data]) => ({
                productId,
                productName: data.name,
                viewCount: data.count,
            }))
                .sort((a, b) => b.viewCount - a.viewCount)
                .slice(0, 5);
            return {
                totalInteractions,
                byType,
                mostViewedProducts,
            };
        }),
    },
};
exports.default = interactionAnalytics;
