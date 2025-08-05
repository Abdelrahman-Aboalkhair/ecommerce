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
exports.VariantRepository = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class VariantRepository {
    findManyVariants(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { where = {}, orderBy = { createdAt: "desc" }, skip = 0, take = 10, select, } = params;
            const { productSlug } = where, restWhere = __rest(where, ["productSlug"]);
            const finalWhere = Object.assign(Object.assign({}, restWhere), (productSlug
                ? {
                    product: {
                        slug: {
                            equals: productSlug,
                            mode: "insensitive",
                        },
                    },
                }
                : {}));
            return database_config_1.default.productVariant.findMany({
                where: finalWhere,
                orderBy,
                skip,
                take,
                select,
                include: {
                    product: true,
                    attributes: {
                        include: {
                            attribute: true,
                            value: true,
                        },
                    },
                },
            });
        });
    }
    countVariants(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { where = {} } = params;
            return database_config_1.default.productVariant.count({ where });
        });
    }
    findVariantById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.productVariant.findUnique({
                where: { id },
                include: {
                    product: true,
                    attributes: {
                        include: {
                            attribute: true,
                            value: true,
                        },
                    },
                },
            });
        });
    }
    findVariantBySku(sku) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.productVariant.findUnique({
                where: { sku },
                include: {
                    product: true,
                    attributes: {
                        include: {
                            attribute: true,
                            value: true,
                        },
                    },
                },
            });
        });
    }
    findRestockHistory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { variantId, skip = 0, take = 10 } = params;
            return database_config_1.default.restock.findMany({
                where: { variantId },
                orderBy: { createdAt: "desc" },
                skip,
                take,
                include: {
                    variant: true,
                    user: { select: { id: true, name: true } },
                },
            });
        });
    }
    countRestocks(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.restock.count({ where: { variantId: params.variantId } });
        });
    }
    createVariant(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { attributes } = data, variantData = __rest(data, ["attributes"]);
            return database_config_1.default.productVariant.create({
                data: Object.assign(Object.assign({}, variantData), { attributes: {
                        create: attributes.map((attr) => ({
                            attributeId: attr.attributeId,
                            valueId: attr.valueId,
                        })),
                    } }),
                include: {
                    attributes: {
                        include: {
                            attribute: true,
                            value: true,
                        },
                    },
                    product: true,
                },
            });
        });
    }
    updateVariant(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { attributes } = data, variantData = __rest(data, ["attributes"]);
            return database_config_1.default.productVariant.update({
                where: { id },
                data: Object.assign(Object.assign({}, variantData), (attributes
                    ? {
                        attributes: {
                            deleteMany: {},
                            create: attributes.map((attr) => ({
                                attributeId: attr.attributeId,
                                valueId: attr.valueId,
                            })),
                        },
                    }
                    : {})),
                include: {
                    attributes: {
                        include: {
                            attribute: true,
                            value: true,
                        },
                    },
                    product: true,
                },
            });
        });
    }
    deleteVariant(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.productVariant.delete({
                where: { id },
            });
        });
    }
    createRestock(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.restock.create({
                data,
                include: { variant: true },
            });
        });
    }
    updateVariantStock(variantId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.productVariant.update({
                where: { id: variantId },
                data: { stock: { increment: quantity } },
            });
        });
    }
    createStockMovement(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.stockMovement.create({
                data,
            });
        });
    }
}
exports.VariantRepository = VariantRepository;
