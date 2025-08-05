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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const logs_factory_1 = require("../logs/logs.factory");
const generateCsv_1 = __importDefault(require("@/shared/utils/export/generateCsv"));
const generatePdf_1 = __importDefault(require("@/shared/utils/export/generatePdf"));
const generateXlsx_1 = __importDefault(require("@/shared/utils/export/generateXlsx"));
class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.generateReport = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { type, format, timePeriod, year, startDate, endDate } = req.query;
            const user = req.user; // From auth middleware
            // Validate format
            const validFormats = ["csv", "pdf", "xlsx"];
            if (!format || !validFormats.includes(format)) {
                throw new AppError_1.default(400, "Invalid format. Use: csv, pdf, or xlsx");
            }
            // Validate type
            const validTypes = ["sales", "user_retention", "all"];
            if (!type || !validTypes.includes(type)) {
                throw new AppError_1.default(400, "Invalid type. Use: sales, user_retention, or all");
            }
            // Validate timePeriod
            const validPeriods = [
                "last7days",
                "lastMonth",
                "lastYear",
                "allTime",
                "custom",
            ];
            if (!timePeriod || !validPeriods.includes(timePeriod)) {
                throw new AppError_1.default(400, "Invalid or missing timePeriod. Use: last7days, lastMonth, lastYear, allTime, or custom");
            }
            // Validate year if provided
            let selectedYear;
            if (year) {
                selectedYear = parseInt(year, 10);
                if (isNaN(selectedYear)) {
                    throw new AppError_1.default(400, "Invalid year format.");
                }
            }
            // Validate custom date range
            let customStartDate;
            let customEndDate;
            if (startDate && endDate) {
                customStartDate = new Date(startDate);
                customEndDate = new Date(endDate);
                if (isNaN(customStartDate.getTime()) || isNaN(customEndDate.getTime())) {
                    throw new AppError_1.default(400, "Invalid startDate or endDate format. Use YYYY-MM-DD.");
                }
                if (customStartDate > customEndDate) {
                    throw new AppError_1.default(400, "startDate must be before endDate.");
                }
            }
            else if (startDate || endDate) {
                throw new AppError_1.default(400, "Both startDate and endDate must be provided for a custom range.");
            }
            const query = {
                timePeriod: timePeriod,
                year: selectedYear,
                startDate: customStartDate,
                endDate: customEndDate,
            };
            let data;
            let filename;
            switch (type) {
                case "sales":
                    data = yield this.reportsService.generateSalesReport(query);
                    filename = `sales-report-${new Date().toISOString()}.${format}`;
                    break;
                case "user_retention":
                    data = yield this.reportsService.generateUserRetentionReport(query);
                    filename = `user-retention-report-${new Date().toISOString()}.${format}`;
                    break;
                case "all":
                    data = {
                        sales: yield this.reportsService.generateSalesReport(query),
                        userRetention: yield this.reportsService.generateUserRetentionReport(query),
                    };
                    filename = `combined-report-${new Date().toISOString()}.${format}`;
                    break;
                default:
                    throw new AppError_1.default(400, "Invalid report type");
            }
            // Log report generation in database
            yield this.reportsService.logReport({
                type: type,
                format: format,
                userId: user === null || user === void 0 ? void 0 : user.id,
                parameters: query,
            });
            let result;
            let contentType;
            const start = Date.now();
            switch (format) {
                case "csv":
                    result = (0, generateCsv_1.default)(data);
                    contentType = "text/csv";
                    break;
                case "pdf":
                    result = yield (0, generatePdf_1.default)(data);
                    contentType = "application/pdf";
                    break;
                case "xlsx":
                    result = yield (0, generateXlsx_1.default)(data);
                    contentType =
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    break;
                default:
                    throw new AppError_1.default(400, "Invalid format");
            }
            const end = Date.now();
            res.setHeader("Content-Type", contentType);
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
            res.send(result);
            // Log to logs service
            yield this.logsService.info("Report generated", {
                userId: user === null || user === void 0 ? void 0 : user.id,
                sessionId: (_a = req.session) === null || _a === void 0 ? void 0 : _a.id,
                timePeriod: end - start,
                reportType: type,
                format,
            });
        }));
    }
}
exports.ReportsController = ReportsController;
