"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePercentageChange = void 0;
const calculatePercentageChange = (current, previous) => {
    // * Handle edge case: avoid division by zero
    // ? Example: current = 50, previous = 0 → Treat as 100% increase if current > 0
    // This assumes a jump from nothing to something is a full (100%) increase
    if (previous === 0)
        return current > 0 ? 100 : 0;
    // * Standard percentage change formula:
    // ? Example: current = 120, previous = 100
    // ((120 - 100) / 100) * 100 = 20%
    return Number((((current - previous) / previous) * 100).toFixed(2));
};
exports.calculatePercentageChange = calculatePercentageChange;
