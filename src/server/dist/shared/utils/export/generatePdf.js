"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generatePDF;
const pdfkit_1 = __importDefault(require("pdfkit"));
function generatePDF(data) {
    return new Promise((resolve, reject) => {
        var _a;
        const doc = new pdfkit_1.default({ margin: 50 });
        const buffers = [];
        doc.on("data", (chunk) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", (err) => reject(new Error(`PDF generation failed: ${err.message}`)));
        try {
            doc
                .fontSize(16)
                .font("Helvetica-Bold")
                .text("Report", { align: "center" })
                .moveDown(1);
            if ("sales" in data && "userRetention" in data) {
                // AllReports
                const { sales, userRetention } = data;
                // Sales Section
                doc
                    .fontSize(12)
                    .font("Helvetica")
                    .text("Sales Report", { underline: true })
                    .moveDown(0.5);
                doc
                    .fontSize(10)
                    .text(`Total Revenue: $${sales.totalRevenue.toFixed(2)}`)
                    .text(`Total Orders: ${sales.totalOrders}`)
                    .text(`Total Sales: ${sales.totalSales}`)
                    .text(`Average Order Value: $${sales.averageOrderValue.toFixed(2)}`)
                    .moveDown(0.5);
                doc.fontSize(12).text("By Category", { underline: true }).moveDown(0.5);
                sales.byCategory.forEach((cat, index) => {
                    doc
                        .fontSize(10)
                        .text(`Category ${index + 1}: ${cat.categoryName}`)
                        .text(`Category ID: ${cat.categoryId}`)
                        .text(`Revenue: $${cat.revenue.toFixed(2)}`)
                        .text(`Sales: ${cat.sales}`)
                        .moveDown(0.5);
                });
                doc
                    .fontSize(12)
                    .text("Top Products", { underline: true })
                    .moveDown(0.5);
                sales.topProducts.forEach((prod, index) => {
                    doc
                        .fontSize(10)
                        .text(`Product ${index + 1}: ${prod.productName}`)
                        .text(`Product ID: ${prod.productId}`)
                        .text(`Quantity: ${prod.quantity}`)
                        .text(`Revenue: $${prod.revenue.toFixed(2)}`)
                        .moveDown(0.5);
                });
                // User Retention Section
                doc
                    .fontSize(12)
                    .text("User Retention Report", { underline: true })
                    .moveDown(0.5);
                doc
                    .fontSize(10)
                    .text(`Total Users: ${userRetention.totalUsers}`)
                    .text(`Retention Rate: ${userRetention.retentionRate.toFixed(2)}%`)
                    .text(`Repeat Purchase Rate: ${userRetention.repeatPurchaseRate.toFixed(2)}%`)
                    .text(`Lifetime Value: $${userRetention.lifetimeValue.toFixed(2)}`)
                    .moveDown(0.5);
                doc.fontSize(12).text("Top Users", { underline: true }).moveDown(0.5);
                userRetention.topUsers.forEach((user, index) => {
                    doc
                        .fontSize(10)
                        .text(`User ${index + 1}: ${user.name}`)
                        .text(`User ID: ${user.userId}`)
                        .text(`Email: ${user.email}`)
                        .text(`Order Count: ${user.orderCount}`)
                        .text(`Total Spent: $${user.totalSpent.toFixed(2)}`)
                        .moveDown(0.5);
                });
            }
            else if ("totalUsers" in data && "topUsers" in data) {
                // UserRetentionReport
                const { totalUsers, retentionRate, repeatPurchaseRate, lifetimeValue, topUsers, } = data;
                doc
                    .fontSize(12)
                    .font("Helvetica")
                    .text("User Retention Report", { underline: true })
                    .moveDown(0.5);
                doc
                    .fontSize(10)
                    .text(`Total Users: ${totalUsers}`)
                    .text(`Retention Rate: ${retentionRate.toFixed(2)}%`)
                    .text(`Repeat Purchase Rate: ${repeatPurchaseRate.toFixed(2)}%`)
                    .text(`Lifetime Value: $${lifetimeValue.toFixed(2)}`)
                    .moveDown(0.5);
                doc.fontSize(12).text("Top Users", { underline: true }).moveDown(0.5);
                topUsers.forEach((user, index) => {
                    doc
                        .fontSize(10)
                        .text(`User ${index + 1}: ${user.name}`)
                        .text(`User ID: ${user.userId}`)
                        .text(`Email: ${user.email}`)
                        .text(`Order Count: ${user.orderCount}`)
                        .text(`Total Spent: $${user.totalSpent.toFixed(2)}`)
                        .moveDown(0.5);
                });
            }
            else if ("totalRevenue" in data && "byCategory" in data) {
                // SalesReport
                const { totalRevenue, totalOrders, totalSales, averageOrderValue, byCategory, topProducts, } = data;
                doc
                    .fontSize(12)
                    .font("Helvetica")
                    .text("Sales Report", { underline: true })
                    .moveDown(0.5);
                doc
                    .fontSize(10)
                    .text(`Total Revenue: $${totalRevenue.toFixed(2)}`)
                    .text(`Total Orders: ${totalOrders}`)
                    .text(`Total Sales: ${totalSales}`)
                    .text(`Average Order Value: $${averageOrderValue.toFixed(2)}`)
                    .moveDown(0.5);
                doc.fontSize(12).text("By Category", { underline: true }).moveDown(0.5);
                byCategory.forEach((cat, index) => {
                    doc
                        .fontSize(10)
                        .text(`Category ${index + 1}: ${cat.categoryName}`)
                        .text(`Category ID: ${cat.categoryId}`)
                        .text(`Revenue: $${cat.revenue.toFixed(2)}`)
                        .text(`Sales: ${cat.sales}`)
                        .moveDown(0.5);
                });
                doc
                    .fontSize(12)
                    .text("Top Products", { underline: true })
                    .moveDown(0.5);
                topProducts.forEach((prod, index) => {
                    doc
                        .fontSize(10)
                        .text(`Product ${index + 1}: ${prod.productName}`)
                        .text(`Product ID: ${prod.productId}`)
                        .text(`Quantity: ${prod.quantity}`)
                        .text(`Revenue: $${prod.revenue.toFixed(2)}`)
                        .moveDown(0.5);
                });
            }
            else if ("overview" in data && "products" in data && "users" in data) {
                // AllAnalytics
                const { overview, products, users } = data;
                doc
                    .fontSize(12)
                    .font("Helvetica")
                    .text("Analytics Overview", { underline: true })
                    .moveDown(0.5);
                doc
                    .fontSize(10)
                    .text(`Total Revenue: $${overview.totalRevenue.toFixed(2)}`)
                    .text(`Total Orders: ${overview.totalOrders}`)
                    .text(`Total Sales: ${overview.totalSales}`)
                    .text(`Total Users: ${overview.totalUsers}`)
                    .text(`Average Order Value: $${overview.averageOrderValue.toFixed(2)}`)
                    .moveDown(0.5);
                doc.fontSize(12).text("Changes", { underline: true }).moveDown(0.5);
                doc
                    .fontSize(10)
                    .text(`Revenue Change: ${overview.changes.revenue
                    ? overview.changes.revenue.toFixed(2) + "%"
                    : "N/A"}`)
                    .text(`Orders Change: ${overview.changes.orders
                    ? overview.changes.orders.toFixed(2) + "%"
                    : "N/A"}`)
                    .text(`Sales Change: ${overview.changes.sales
                    ? overview.changes.sales.toFixed(2) + "%"
                    : "N/A"}`)
                    .text(`Users Change: ${overview.changes.users
                    ? overview.changes.users.toFixed(2) + "%"
                    : "N/A"}`)
                    .text(`AOV Change: ${overview.changes.averageOrderValue
                    ? overview.changes.averageOrderValue.toFixed(2) + "%"
                    : "N/A"}`)
                    .moveDown(0.5);
                doc
                    .fontSize(12)
                    .text("Monthly Trends", { underline: true })
                    .moveDown(0.5);
                overview.monthlyTrends.labels.forEach((label, index) => {
                    doc
                        .fontSize(10)
                        .text(`${label}:`)
                        .text(`  Revenue: $${overview.monthlyTrends.revenue[index].toFixed(2)}`)
                        .text(`  Orders: ${overview.monthlyTrends.orders[index]}`)
                        .text(`  Sales: ${overview.monthlyTrends.sales[index]}`)
                        .text(`  Users: ${overview.monthlyTrends.users[index]}`)
                        .moveDown(0.5);
                });
                doc
                    .fontSize(12)
                    .text("Product Performance", { underline: true })
                    .moveDown(0.5);
                products.forEach((item, index) => {
                    doc
                        .fontSize(10)
                        .text(`Product ${index + 1}: ${item.name}`)
                        .text(`ID: ${item.id}`)
                        .text(`Quantity Sold: ${item.quantity}`)
                        .text(`Revenue: $${item.revenue.toFixed(2)}`)
                        .moveDown(0.5);
                });
                doc
                    .fontSize(12)
                    .text("User Analytics", { underline: true })
                    .moveDown(0.5);
                doc
                    .fontSize(10)
                    .text(`Total Users: ${users.totalUsers}`)
                    .text(`Total Revenue: $${users.totalRevenue.toFixed(2)}`)
                    .text(`Retention Rate: ${users.retentionRate.toFixed(2)}%`)
                    .text(`Average Lifetime Value: $${users.lifetimeValue.toFixed(2)}`)
                    .text(`Repeat Purchase Rate: ${users.repeatPurchaseRate.toFixed(2)}%`)
                    .text(`Average Engagement Score: ${users.engagementScore.toFixed(2)}`)
                    .text(`Users Change: ${((_a = users.changes) === null || _a === void 0 ? void 0 : _a.users)
                    ? users.changes.users.toFixed(2) + "%"
                    : "N/A"}`)
                    .moveDown(1);
                doc.fontSize(12).text("Top Users", { underline: true }).moveDown(0.5);
                users.topUsers.forEach((user, index) => {
                    doc
                        .fontSize(10)
                        .text(`User ${index + 1}: ${user.name}`)
                        .text(`Email: ${user.email}`)
                        .text(`Orders: ${user.orderCount}`)
                        .text(`Total Spent: $${user.totalSpent.toFixed(2)}`)
                        .text(`Engagement Score: ${user.engagementScore.toFixed(2)}`)
                        .moveDown(0.5);
                });
                doc
                    .fontSize(12)
                    .text("Interaction Trends", { underline: true })
                    .moveDown(0.5);
                users.interactionTrends.labels.forEach((label, index) => {
                    doc
                        .fontSize(10)
                        .text(`${label}:`)
                        .text(`  Views: ${users.interactionTrends.views[index]}`)
                        .text(`  Clicks: ${users.interactionTrends.clicks[index]}`)
                        .text(`  Others: ${users.interactionTrends.others[index]}`)
                        .moveDown(0.5);
                });
            }
            else {
                throw new Error("Unsupported data format for PDF export");
            }
            doc.end();
        }
        catch (err) {
            doc.end();
            reject(new Error(`PDF generation failed: ${err.message}`));
        }
    });
}
