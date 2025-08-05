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
exports.default = generateXLSX;
const exceljs_1 = __importDefault(require("exceljs"));
function generateXLSX(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const workbook = new exceljs_1.default.Workbook();
        if ("sales" in data && "userRetention" in data) {
            // AllReports
            const { sales, userRetention } = data;
            // Sales Sheet
            const salesSheet = workbook.addWorksheet("Sales");
            salesSheet.columns = [
                { header: "Metric", key: "metric", width: 30 },
                { header: "Value", key: "value", width: 20 },
            ];
            salesSheet.addRows([
                { metric: "Total Revenue ($)", value: sales.totalRevenue },
                { metric: "Total Orders", value: sales.totalOrders },
                { metric: "Total Sales", value: sales.totalSales },
                { metric: "Average Order Value ($)", value: sales.averageOrderValue },
            ]);
            salesSheet.addRow([]); // Spacer
            salesSheet.addRow(["By Category"]);
            salesSheet.addRow(["Category ID", "Category Name", "Revenue ($)", "Sales"]);
            sales.byCategory.forEach((cat) => {
                salesSheet.addRow([
                    cat.categoryId,
                    cat.categoryName,
                    cat.revenue,
                    cat.sales,
                ]);
            });
            salesSheet.addRow([]); // Spacer
            salesSheet.addRow(["Top Products"]);
            salesSheet.addRow([
                "Product ID",
                "Product Name",
                "Quantity",
                "Revenue ($)",
            ]);
            sales.topProducts.forEach((prod) => {
                salesSheet.addRow([
                    prod.productId,
                    prod.productName,
                    prod.quantity,
                    prod.revenue,
                ]);
            });
            // User Retention Sheet
            const retentionSheet = workbook.addWorksheet("User Retention");
            retentionSheet.columns = [
                { header: "Metric", key: "metric", width: 30 },
                { header: "Value", key: "value", width: 20 },
            ];
            retentionSheet.addRows([
                { metric: "Total Users", value: userRetention.totalUsers },
                { metric: "Retention Rate (%)", value: userRetention.retentionRate },
                {
                    metric: "Repeat Purchase Rate (%)",
                    value: userRetention.repeatPurchaseRate,
                },
                { metric: "Lifetime Value ($)", value: userRetention.lifetimeValue },
            ]);
            retentionSheet.addRow([]); // Spacer
            retentionSheet.addRow(["Top Users"]);
            retentionSheet.addRow([
                "Rank",
                "User ID",
                "Name",
                "Email",
                "Order Count",
                "Total Spent ($)",
            ]);
            userRetention.topUsers.forEach((user, index) => {
                retentionSheet.addRow([
                    index + 1,
                    user.userId,
                    user.name,
                    user.email,
                    user.orderCount,
                    user.totalSpent,
                ]);
            });
        }
        else if ("totalUsers" in data && "topUsers" in data) {
            // UserRetentionReport
            const { totalUsers, retentionRate, repeatPurchaseRate, lifetimeValue, topUsers, } = data;
            const sheet = workbook.addWorksheet("User Retention");
            sheet.columns = [
                { header: "Metric", key: "metric", width: 30 },
                { header: "Value", key: "value", width: 20 },
            ];
            sheet.addRows([
                { metric: "Total Users", value: totalUsers },
                { metric: "Retention Rate (%)", value: retentionRate },
                { metric: "Repeat Purchase Rate (%)", value: repeatPurchaseRate },
                { metric: "Lifetime Value ($)", value: lifetimeValue },
            ]);
            sheet.addRow([]); // Spacer
            sheet.addRow(["Top Users"]);
            sheet.addRow([
                "Rank",
                "User ID",
                "Name",
                "Email",
                "Order Count",
                "Total Spent ($)",
            ]);
            topUsers.forEach((user, index) => {
                sheet.addRow([
                    index + 1,
                    user.userId,
                    user.name,
                    user.email,
                    user.orderCount,
                    user.totalSpent,
                ]);
            });
        }
        else if ("totalRevenue" in data && "byCategory" in data) {
            // SalesReport
            const { totalRevenue, totalOrders, totalSales, averageOrderValue, byCategory, topProducts, } = data;
            const sheet = workbook.addWorksheet("Sales");
            sheet.columns = [
                { header: "Metric", key: "metric", width: 30 },
                { header: "Value", key: "value", width: 20 },
            ];
            sheet.addRows([
                { metric: "Total Revenue ($)", value: totalRevenue },
                { metric: "Total Orders", value: totalOrders },
                { metric: "Total Sales", value: totalSales },
                { metric: "Average Order Value ($)", value: averageOrderValue },
            ]);
            sheet.addRow([]); // Spacer
            sheet.addRow(["By Category"]);
            sheet.addRow(["Category ID", "Category Name", "Revenue ($)", "Sales"]);
            byCategory.forEach((cat) => {
                sheet.addRow([cat.categoryId, cat.categoryName, cat.revenue, cat.sales]);
            });
            sheet.addRow([]); // Spacer
            sheet.addRow(["Top Products"]);
            sheet.addRow(["Product ID", "Product Name", "Quantity", "Revenue ($)"]);
            topProducts.forEach((prod) => {
                sheet.addRow([
                    prod.productId,
                    prod.productName,
                    prod.quantity,
                    prod.revenue,
                ]);
            });
        }
        else if ("overview" in data && "products" in data && "users" in data) {
            // AllAnalytics
            const { overview, products, users } = data;
            const overviewSheet = workbook.addWorksheet("Overview");
            overviewSheet.columns = [
                { header: "Metric", key: "metric", width: 30 },
                { header: "Value", key: "value", width: 20 },
            ];
            overviewSheet.addRows([
                { metric: "Total Revenue ($)", value: overview.totalRevenue },
                { metric: "Total Orders", value: overview.totalOrders },
                { metric: "Total Sales", value: overview.totalSales },
                { metric: "Total Users", value: overview.totalUsers },
                {
                    metric: "Average Order Value ($)",
                    value: overview.averageOrderValue,
                },
            ]);
            overviewSheet.addRow([]); // Spacer
            overviewSheet.addRow(["Changes"]);
            overviewSheet.addRows([
                {
                    metric: "Revenue Change (%)",
                    value: overview.changes.revenue || "N/A",
                },
                {
                    metric: "Orders Change (%)",
                    value: overview.changes.orders || "N/A",
                },
                { metric: "Sales Change (%)", value: overview.changes.sales || "N/A" },
                { metric: "Users Change (%)", value: overview.changes.users || "N/A" },
                {
                    metric: "AOV Change (%)",
                    value: overview.changes.averageOrderValue || "N/A",
                },
            ]);
            overviewSheet.addRow([]); // Spacer
            overviewSheet.addRow(["Monthly Trends"]);
            overviewSheet.addRow(["Month", "Revenue ($)", "Orders", "Sales", "Users"]);
            overview.monthlyTrends.labels.forEach((label, index) => {
                overviewSheet.addRow([
                    label,
                    overview.monthlyTrends.revenue[index],
                    overview.monthlyTrends.orders[index],
                    overview.monthlyTrends.sales[index],
                    overview.monthlyTrends.users[index],
                ]);
            });
            const productsSheet = workbook.addWorksheet("Products");
            productsSheet.columns = [
                { header: "ID", key: "id", width: 30 },
                { header: "Product Name", key: "name", width: 30 },
                { header: "Quantity Sold", key: "quantity", width: 15 },
                { header: "Revenue ($)", key: "revenue", width: 15 },
            ];
            products.forEach((item) => {
                productsSheet.addRow({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    revenue: item.revenue,
                });
            });
            const usersSheet = workbook.addWorksheet("Users");
            usersSheet.columns = [
                { header: "Metric", key: "metric", width: 30 },
                { header: "Value", key: "value", width: 20 },
            ];
            usersSheet.addRows([
                { metric: "Total Users", value: users.totalUsers },
                { metric: "Total Revenue ($)", value: users.totalRevenue },
                { metric: "Retention Rate (%)", value: users.retentionRate },
                { metric: "Average Lifetime Value ($)", value: users.lifetimeValue },
                { metric: "Repeat Purchase Rate (%)", value: users.repeatPurchaseRate },
                { metric: "Average Engagement Score", value: users.engagementScore },
                {
                    metric: "Users Change (%)",
                    value: users.changes.users || "N/A",
                },
            ]);
            usersSheet.addRow([]); // Spacer
            usersSheet.addRow(["Top Users"]);
            usersSheet.addRow([
                "Rank",
                "Name",
                "Email",
                "Order Count",
                "Total Spent ($)",
                "Engagement Score",
            ]);
            users.topUsers.forEach((user, index) => {
                usersSheet.addRow([
                    index + 1,
                    user.name,
                    user.email,
                    user.orderCount,
                    user.totalSpent,
                    user.engagementScore,
                ]);
            });
            const trendsSheet = workbook.addWorksheet("Interaction Trends");
            trendsSheet.columns = [
                { header: "Month", key: "month", width: 20 },
                { header: "Views", key: "views", width: 15 },
                { header: "Clicks", key: "clicks", width: 15 },
                { header: "Others", key: "others", width: 15 },
            ];
            users.interactionTrends.labels.forEach((label, index) => {
                trendsSheet.addRow({
                    month: label,
                    views: users.interactionTrends.views[index],
                    clicks: users.interactionTrends.clicks[index],
                    others: users.interactionTrends.others[index],
                });
            });
        }
        else {
            throw new Error("Unsupported data format for XLSX export");
        }
        workbook.eachSheet((sheet) => {
            sheet.getRow(1).font = { bold: true };
            sheet.eachRow((row) => {
                row.alignment = { vertical: "middle", horizontal: "left" };
            });
        });
        return workbook.xlsx.writeBuffer();
    });
}
