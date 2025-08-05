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
exports.AnalyticsRepository = void 0;
const client_1 = require("@prisma/client");
class AnalyticsRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getOrderYearRange() {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.prisma.order.findMany({
                select: { orderDate: true },
                orderBy: { orderDate: "asc" },
            });
            const years = [
                ...new Set(orders.map((order) => order.orderDate.getFullYear())),
            ];
            return years;
        });
    }
    getOrdersByTimePeriod(start, end, yearStart, yearEnd) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.order.findMany({
                where: {
                    orderDate: {
                        gte: start || yearStart,
                        lte: end || yearEnd,
                    },
                },
                include: { user: true },
            });
        });
    }
    getOrderItemsByTimePeriod(start, end, yearStart, yearEnd, category) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.orderItem.findMany({
                where: Object.assign({ createdAt: {
                        gte: start || yearStart,
                        lte: end || yearEnd,
                    } }, (category && {
                    product: {
                        category: {
                            name: category,
                        },
                    },
                })),
                include: { variant: true },
            });
        });
    }
    getUsersByTimePeriod(start, end, yearStart, yearEnd) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.findMany({
                where: {
                    createdAt: {
                        gte: start || yearStart,
                        lte: end || yearEnd,
                    },
                },
                include: { orders: true },
            });
        });
    }
    getInteractionsByTimePeriod(start, end, yearStart, yearEnd) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.interaction.findMany({
                where: {
                    createdAt: {
                        gte: start || yearStart,
                        lte: end || yearEnd,
                    },
                },
                include: { user: true, product: true },
            });
        });
    }
    createInteraction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.interaction.create({
                data: {
                    userId: data.userId,
                    sessionId: data.sessionId,
                    productId: data.productId,
                    type: data.type,
                },
            });
        });
    }
}
exports.AnalyticsRepository = AnalyticsRepository;
