"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAnalyticsController = void 0;
const analytics_controller_1 = require("./analytics.controller");
const analytics_repository_1 = require("./analytics.repository");
const analytics_service_1 = require("./analytics.service");
const makeAnalyticsController = () => {
    const repo = new analytics_repository_1.AnalyticsRepository();
    const service = new analytics_service_1.AnalyticsService(repo);
    const controller = new analytics_controller_1.AnalyticsController(service);
    return controller;
};
exports.makeAnalyticsController = makeAnalyticsController;
