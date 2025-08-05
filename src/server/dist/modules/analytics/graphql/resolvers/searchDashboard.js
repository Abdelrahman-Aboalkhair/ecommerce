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
exports.searchDashboardResolver = void 0;
const searchModel_1 = __importDefault(require("@/shared/utils/searchModel"));
exports.searchDashboardResolver = {
    Query: {
        searchDashboard: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { params }, { prisma }) {
            const { searchQuery } = params;
            const transactions = yield (0, searchModel_1.default)("transaction", [{ name: "status", isString: false }], searchQuery, prisma);
            const products = yield (0, searchModel_1.default)("product", [
                { name: "name", isString: true },
                { name: "description", isString: true },
            ], searchQuery, prisma);
            const categories = yield (0, searchModel_1.default)("category", [
                { name: "name", isString: true },
                { name: "description", isString: true },
            ], searchQuery, prisma);
            const users = yield (0, searchModel_1.default)("user", [
                { name: "name", isString: true },
                { name: "email", isString: true },
            ], searchQuery, prisma);
            const results = [
                ...transactions.map((t) => ({
                    type: "transaction",
                    id: t.id,
                    title: `Transaction #${t.id}`,
                    description: `$${t.amount || 0} - ${t.status || "Pending"}`,
                })),
                ...products.map((p) => {
                    var _a, _b;
                    return ({
                        type: "product",
                        id: p.id,
                        title: p.name,
                        description: p.description || `$${((_b = (_a = p.variants) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.price) || 0}`, // Updated to use variants
                    });
                }),
                ...categories.map((c) => ({
                    type: "category",
                    id: c.id,
                    title: c.name,
                    description: c.description,
                })),
                ...users.map((u) => ({
                    type: "user",
                    id: u.id,
                    title: u.name,
                    description: u.email,
                })),
            ];
            return results;
        }),
    },
};
