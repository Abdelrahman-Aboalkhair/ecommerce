"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsResolvers = void 0;
const productPerformance_1 = __importDefault(require("./resolvers/productPerformance"));
const yearRange_1 = __importDefault(require("./resolvers/yearRange"));
const userAnalytics_1 = __importDefault(require("./resolvers/userAnalytics"));
const interactionAnalytics_1 = __importDefault(require("./resolvers/interactionAnalytics"));
const searchDashboard_1 = require("./resolvers/searchDashboard");
const orderAnalytics_1 = __importDefault(require("./resolvers/orderAnalytics"));
const revenueAnalytics_1 = __importDefault(require("./resolvers/revenueAnalytics"));
const userAnalytics_2 = __importDefault(require("./resolvers/userAnalytics"));
const abandonedCartAnalytics_1 = __importDefault(require("./resolvers/abandonedCartAnalytics"));
exports.analyticsResolvers = {
    Query: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, orderAnalytics_1.default.Query), revenueAnalytics_1.default.Query), userAnalytics_2.default.Query), yearRange_1.default.Query), userAnalytics_1.default.Query), interactionAnalytics_1.default.Query), productPerformance_1.default.Query), searchDashboard_1.searchDashboardResolver.Query), abandonedCartAnalytics_1.default.Query),
};
