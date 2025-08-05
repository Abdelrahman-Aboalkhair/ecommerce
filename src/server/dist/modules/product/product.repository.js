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
exports.ProductRepository = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class ProductRepository {
    findManyProducts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { where = {}, orderBy = { createdAt: "desc" }, skip = 0, take = 10, select, } = params;
            const { categorySlug } = where, restWhere = __rest(where, ["categorySlug"]);
            const finalWhere = Object.assign(Object.assign({}, restWhere), (categorySlug
                ? {
                    category: {
                        is: {
                            slug: {
                                equals: categorySlug,
                                mode: "insensitive",
                            },
                        },
                    },
                }
                : {}));
            return database_config_1.default.product.findMany({
                where: finalWhere,
                orderBy,
                skip,
                take,
                select,
                include: {
                    variants: {
                        include: {
                            attributes: {
                                include: {
                                    attribute: true,
                                    value: true,
                                },
                            },
                        },
                    },
                },
            });
        });
    }
    countProducts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { where = {} } = params;
            return database_config_1.default.product.count({ where });
        });
    }
    findProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.product.findUnique({
                where: { id },
                include: {
                    category: true,
                    variants: {
                        include: {
                            attributes: {
                                include: {
                                    attribute: true,
                                    value: true,
                                },
                            },
                        },
                    },
                },
            });
        });
    }
    findProductByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.product.findUnique({
                where: { name },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            });
        });
    }
    findProductBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.product.findUnique({
                where: { slug },
                include: {
                    category: true,
                    variants: {
                        include: {
                            attributes: {
                                include: {
                                    attribute: true,
                                    value: true,
                                },
                            },
                        },
                    },
                },
            });
        });
    }
    findProductNameById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_config_1.default.product.findUnique({
                where: { id },
                select: { name: true },
            });
            return (product === null || product === void 0 ? void 0 : product.name) || null;
        });
    }
    createProduct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.product.create({
                data,
                include: {
                    category: true,
                    variants: {
                        include: {
                            attributes: { include: { attribute: true, value: true } },
                        },
                    },
                },
            });
        });
    }
    createManyProducts(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.product.createMany({
                data,
                skipDuplicates: true,
            });
        });
    }
    incrementSalesCount(id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.product.update({
                where: { id },
                data: { salesCount: { increment: quantity } },
            });
        });
    }
    updateProduct(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.product.update({
                where: { id },
                data,
                include: {
                    category: true,
                    variants: {
                        include: {
                            attributes: {
                                include: {
                                    attribute: true,
                                    value: true,
                                },
                            },
                        },
                    },
                },
            });
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.product.delete({
                where: { id },
            });
        });
    }
}
exports.ProductRepository = ProductRepository;
