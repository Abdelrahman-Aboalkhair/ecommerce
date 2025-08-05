"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateCSV;
const formatAnalyticsData_1 = __importDefault(require("./formatAnalyticsData"));
const sync_1 = __importDefault(require("csv-stringify/sync"));
function generateCSV(data) {
    const formattedData = (0, formatAnalyticsData_1.default)(data);
    return sync_1.default.stringify(formattedData, {
        header: true,
        quoted: true,
        quoted_empty: true,
    });
}
