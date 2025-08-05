"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRetentionRate = void 0;
const calculateRetentionRate = (currentUsers, previousUsers) => {
    if (!previousUsers.length)
        return 0;
    const previousUserIds = new Set(previousUsers.map((user) => user.id));
    const retainedCustomers = currentUsers.filter((user) => previousUserIds.has(user.id) && user.orders.length > 0).length;
    return (retainedCustomers / previousUsers.length) * 100;
};
exports.calculateRetentionRate = calculateRetentionRate;
