"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = formatAnalyticsData;
const flattenObject_1 = __importDefault(require("../flattenObject"));
function formatAnalyticsData(data) {
    if (Array.isArray(data)) {
        // ProductPerformance[]
        return data.map((item) => (0, flattenObject_1.default)(item));
    }
    else if ("overview" in data && "products" in data && "users" in data) {
        // AllAnalytics
        const { overview, products, users } = data;
        const overviewData = (0, flattenObject_1.default)(Object.assign(Object.assign({}, overview), { changes: overview.changes, monthlyTrends: {
                labels: JSON.stringify(overview.monthlyTrends.labels),
                revenue: JSON.stringify(overview.monthlyTrends.revenue),
                orders: JSON.stringify(overview.monthlyTrends.orders),
                sales: JSON.stringify(overview.monthlyTrends.sales),
                users: JSON.stringify(overview.monthlyTrends.users),
            } }));
        const productsData = products.map((item, index) => (Object.assign({ productRank: index + 1 }, (0, flattenObject_1.default)(item))));
        const usersData = [
            (0, flattenObject_1.default)(Object.assign(Object.assign({}, users), { changes: users.changes, interactionTrends: {
                    labels: JSON.stringify(users.interactionTrends.labels),
                    views: JSON.stringify(users.interactionTrends.views),
                    clicks: JSON.stringify(users.interactionTrends.clicks),
                    others: JSON.stringify(users.interactionTrends.others),
                } })),
            ...users.topUsers.map((user, index) => (Object.assign({ topUserRank: index + 1 }, (0, flattenObject_1.default)(user)))),
        ];
        return [overviewData, ...productsData, ...usersData];
    }
    else if ("totalUsers" in data &&
        "topUsers" in data &&
        "interactionTrends" in data) {
        // UserAnalytics
        const _a = data, { topUsers, interactionTrends, changes } = _a, rest = __rest(_a, ["topUsers", "interactionTrends", "changes"]);
        const flattenedRest = (0, flattenObject_1.default)(Object.assign(Object.assign({}, rest), { changes, interactionTrends: {
                labels: JSON.stringify(interactionTrends.labels),
                views: JSON.stringify(interactionTrends.views),
                clicks: JSON.stringify(interactionTrends.clicks),
                others: JSON.stringify(interactionTrends.others),
            } }));
        return [
            flattenedRest,
            ...topUsers.map((user, index) => (Object.assign({ topUserRank: index + 1 }, (0, flattenObject_1.default)(user)))),
        ];
    }
    else if ("totalRevenue" in data && "monthlyTrends" in data) {
        // AnalyticsOverview
        const _b = data, { monthlyTrends, changes } = _b, rest = __rest(_b, ["monthlyTrends", "changes"]);
        const flattenedRest = (0, flattenObject_1.default)(Object.assign(Object.assign({}, rest), { changes, monthlyTrends: {
                labels: JSON.stringify(monthlyTrends.labels),
                revenue: JSON.stringify(monthlyTrends.revenue),
                orders: JSON.stringify(monthlyTrends.orders),
                sales: JSON.stringify(monthlyTrends.sales),
                users: JSON.stringify(monthlyTrends.users),
            } }));
        return [flattenedRest];
    }
    else if ("sales" in data && "userRetention" in data) {
        // AllReports
        const { sales, userRetention } = data;
        const salesData = (0, flattenObject_1.default)(Object.assign(Object.assign({}, sales), { byCategory: JSON.stringify(sales.byCategory), topProducts: JSON.stringify(sales.topProducts) }));
        const userRetentionData = (0, flattenObject_1.default)(Object.assign(Object.assign({}, userRetention), { topUsers: JSON.stringify(userRetention.topUsers) }));
        return [salesData, userRetentionData];
    }
    else if ("totalUsers" in data && "topUsers" in data) {
        // UserRetentionReport
        const _c = data, { topUsers } = _c, rest = __rest(_c, ["topUsers"]);
        const flattenedRest = (0, flattenObject_1.default)(rest);
        return [
            flattenedRest,
            ...topUsers.map((user, index) => (Object.assign({ topUserRank: index + 1 }, (0, flattenObject_1.default)(user)))),
        ];
    }
    else if ("totalRevenue" in data && "byCategory" in data) {
        // SalesReport
        const _d = data, { byCategory, topProducts } = _d, rest = __rest(_d, ["byCategory", "topProducts"]);
        const flattenedRest = (0, flattenObject_1.default)(Object.assign(Object.assign({}, rest), { byCategory: JSON.stringify(byCategory), topProducts: JSON.stringify(topProducts) }));
        return [flattenedRest];
    }
    else {
        throw new Error("Unsupported data format for export");
    }
}
