"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateChanges = void 0;
const _1 = require(".");
const calculateChanges = (current, previous, shouldCalculate) => shouldCalculate
    ? {
        revenue: (0, _1.calculatePercentageChange)(current.totalRevenue, previous.totalRevenue),
        orders: (0, _1.calculatePercentageChange)(current.totalOrders, previous.totalOrders),
        sales: (0, _1.calculatePercentageChange)(current.totalSales, previous.totalSales),
        users: (0, _1.calculatePercentageChange)(current.totalUsers, previous.totalUsers),
        averageOrderValue: (0, _1.calculatePercentageChange)(current.averageOrderValue, previous.averageOrderValue),
    }
    : {
        revenue: null,
        orders: null,
        sales: null,
        users: null,
        averageOrderValue: null,
    };
exports.calculateChanges = calculateChanges;
