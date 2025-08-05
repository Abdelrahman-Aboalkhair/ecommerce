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
const client_1 = require("@prisma/client");
const analytics_1 = require("@/shared/utils/analytics");
const userAnalytics = {
    Query: {
        userAnalytics: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { params }, { prisma }) {
            var _c;
            const { timePeriod, year, startDate, endDate } = params;
            const { currentStartDate, previousStartDate, previousEndDate, yearStart, yearEnd, } = (0, analytics_1.getDateRange)({ timePeriod, year, startDate, endDate });
            const users = yield (0, analytics_1.fetchData)(prisma, "user", "createdAt", currentStartDate, endDate, yearStart, yearEnd, client_1.ROLE.USER, { orders: true });
            const interactions = yield (0, analytics_1.fetchData)(prisma, "interaction", "createdAt", currentStartDate, endDate, yearStart, yearEnd);
            const fetchPrevious = (0, analytics_1.shouldFetchPreviousPeriod)(timePeriod);
            const previousUsers = fetchPrevious
                ? yield (0, analytics_1.fetchData)(prisma, "user", "createdAt", previousStartDate, previousEndDate, yearStart, yearEnd, client_1.ROLE.USER, { orders: true })
                : [];
            const { totalCustomers: totalUsers, totalRevenue, lifetimeValue, repeatPurchaseRate, } = (0, analytics_1.calculateCustomerMetrics)(users);
            const previousMetrics = fetchPrevious
                ? (0, analytics_1.calculateCustomerMetrics)(previousUsers)
                : { totalCustomers: 0 };
            const retentionRate = fetchPrevious
                ? (0, analytics_1.calculateRetentionRate)(users, previousUsers)
                : 0;
            const { scores: engagementScores, averageScore: engagementScore } = (0, analytics_1.calculateEngagementScores)(interactions);
            const topUsers = (0, analytics_1.generateTopCustomers)(users, engagementScores);
            const interactionTrends = (0, analytics_1.aggregateInteractionTrends)(interactions);
            const changes = (0, analytics_1.calculateChanges)({ totalUsers }, { totalUsers: previousMetrics.totalCustomers }, fetchPrevious);
            return {
                totalUsers,
                totalRevenue: Number(totalRevenue.toFixed(2)),
                retentionRate: Number(retentionRate.toFixed(2)),
                lifetimeValue: Number(lifetimeValue.toFixed(2)),
                repeatPurchaseRate: Number(repeatPurchaseRate.toFixed(2)),
                engagementScore: Number(engagementScore.toFixed(2)),
                topUsers,
                interactionTrends,
                changes: {
                    users: Number((_c = changes.users) === null || _c === void 0 ? void 0 : _c.toFixed(2)) || 0,
                },
            };
        }),
    },
};
exports.default = userAnalytics;
