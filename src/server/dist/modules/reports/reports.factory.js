"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeReportsController = makeReportsController;
const reports_service_1 = require("./reports.service");
const reports_repository_1 = require("./reports.repository");
const analytics_repository_1 = require("../analytics/analytics.repository");
const product_repository_1 = require("../product/product.repository");
const reports_controller_1 = require("./reports.controller");
function makeReportsController() {
    const reportsRepository = new reports_repository_1.ReportsRepository();
    const analyticsRepository = new analytics_repository_1.AnalyticsRepository();
    const productRepository = new product_repository_1.ProductRepository();
    const reportsService = new reports_service_1.ReportsService(reportsRepository, analyticsRepository, productRepository);
    const controller = new reports_controller_1.ReportsController(reportsService);
    return controller;
}
