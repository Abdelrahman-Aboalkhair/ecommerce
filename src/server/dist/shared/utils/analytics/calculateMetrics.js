"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMetrics = void 0;
const calculateMetrics = (orders, orderItems, users) => ({
    totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
    totalOrders: orders.length,
    totalSales: orderItems.reduce((sum, item) => sum + item.quantity, 0),
    totalUsers: users.length,
    // * Average order value tells us how much, on average, a customer spends per order.
    // * For example, if we have 3 orders: [{ amount: 50 }, { amount: 100 }, { amount: 150 }],
    // * the total revenue is 300 and the total orders is 3, so:
    // * averageOrderValue = 300 / 3 = 100.
    // * This metric is useful for understanding customer purchasing behavior.
    averageOrderValue: orders.length > 0
        ? orders.reduce((sum, order) => sum + order.amount, 0) / orders.length
        : 0,
});
exports.calculateMetrics = calculateMetrics;
