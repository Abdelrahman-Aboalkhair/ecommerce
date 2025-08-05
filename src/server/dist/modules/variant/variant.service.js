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
exports.VariantService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
const ApiFeatures_1 = __importDefault(require("@/shared/utils/ApiFeatures"));
class VariantService {
    constructor(variantRepository, attributeRepository) {
        this.variantRepository = variantRepository;
        this.attributeRepository = attributeRepository;
    }
    getAllVariants(queryString) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiFeatures = new ApiFeatures_1.default(queryString)
                .filter()
                .sort()
                .limitFields()
                .paginate()
                .build();
            const { where, orderBy, skip, take, select } = apiFeatures;
            const finalWhere = where && Object.keys(where).length > 0 ? where : {};
            const totalResults = yield this.variantRepository.countVariants({
                where: finalWhere,
            });
            const totalPages = Math.ceil(totalResults / take);
            const currentPage = Math.floor(skip / take) + 1;
            const variants = yield this.variantRepository.findManyVariants({
                where: finalWhere,
                orderBy: orderBy || { createdAt: "desc" },
                skip,
                take,
                select,
            });
            return {
                variants,
                totalResults,
                totalPages,
                currentPage,
                resultsPerPage: take,
            };
        });
    }
    getRestockHistory(variantId_1) {
        return __awaiter(this, arguments, void 0, function* (variantId, page = 1, limit = 10) {
            const skip = (page - 1) * limit;
            const take = limit;
            const totalResults = yield this.variantRepository.countRestocks({
                variantId,
            });
            const totalPages = Math.ceil(totalResults / take);
            const currentPage = page;
            const restocks = yield this.variantRepository.findRestockHistory({
                variantId,
                skip,
                take,
            });
            return {
                restocks,
                totalResults,
                totalPages,
                currentPage,
                resultsPerPage: take,
            };
        });
    }
    getVariantById(variantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const variant = yield this.variantRepository.findVariantById(variantId);
            if (!variant) {
                throw new AppError_1.default(404, "Variant not found");
            }
            return variant;
        });
    }
    getVariantBySku(sku) {
        return __awaiter(this, void 0, void 0, function* () {
            const variant = yield this.variantRepository.findVariantBySku(sku);
            if (!variant) {
                throw new AppError_1.default(404, "Variant not found");
            }
            return variant;
        });
    }
    createVariant(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId, attributes } = data;
            const product = yield database_config_1.default.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new AppError_1.default(404, "Product not found");
            }
            const existingVariant = yield database_config_1.default.productVariant.findUnique({
                where: { sku: data.sku },
            });
            if (existingVariant) {
                throw new AppError_1.default(400, "SKU already exists");
            }
            if (!attributes || attributes.length === 0) {
                throw new AppError_1.default(400, "At least one attribute is required");
            }
            if (product.categoryId) {
                const requiredAttributes = yield database_config_1.default.categoryAttribute.findMany({
                    where: { categoryId: product.categoryId, isRequired: true },
                    select: { attributeId: true },
                });
                const requiredAttributeIds = requiredAttributes.map((attr) => attr.attributeId);
                const variantAttributeIds = attributes.map((attr) => attr.attributeId);
                const missingAttributes = requiredAttributeIds.filter((id) => !variantAttributeIds.includes(id));
                if (missingAttributes.length > 0) {
                    throw new AppError_1.default(400, `Variant is missing required attributes: ${missingAttributes.join(", ")}`);
                }
            }
            const allAttributeIds = [...new Set(attributes.map((a) => a.attributeId))];
            const existingAttributes = yield database_config_1.default.attribute.findMany({
                where: { id: { in: allAttributeIds } },
            });
            if (existingAttributes.length !== allAttributeIds.length) {
                throw new AppError_1.default(400, "One or more attributes are invalid");
            }
            const allValueIds = [...new Set(attributes.map((a) => a.valueId))];
            const existingValues = yield database_config_1.default.attributeValue.findMany({
                where: { id: { in: allValueIds } },
            });
            if (existingValues.length !== allValueIds.length) {
                throw new AppError_1.default(400, "One or more attribute values are invalid");
            }
            if (new Set(allAttributeIds).size !== allAttributeIds.length) {
                throw new AppError_1.default(400, "Duplicate attributes in variant");
            }
            const existingVariants = yield database_config_1.default.productVariant.findMany({
                where: { productId },
                include: { attributes: true },
            });
            const newComboKey = attributes
                .map((a) => `${a.attributeId}:${a.valueId}`)
                .sort()
                .join("|");
            const isDuplicateCombo = existingVariants.some((v) => v.attributes
                .map((a) => `${a.attributeId}:${a.valueId}`)
                .sort()
                .join("|") === newComboKey);
            if (isDuplicateCombo) {
                throw new AppError_1.default(400, "Duplicate attribute combination for this product");
            }
            return this.variantRepository.createVariant(data);
        });
    }
    updateVariant(variantId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingVariant = yield this.variantRepository.findVariantById(variantId);
            if (!existingVariant) {
                throw new AppError_1.default(404, "Variant not found");
            }
            if (data.sku && data.sku !== existingVariant.sku) {
                const existingSku = yield database_config_1.default.productVariant.findUnique({
                    where: { sku: data.sku },
                });
                if (existingSku) {
                    throw new AppError_1.default(400, "SKU already exists");
                }
            }
            if (data.attributes) {
                if (data.attributes.length === 0) {
                    throw new AppError_1.default(400, "At least one attribute is required");
                }
                const product = yield database_config_1.default.product.findUnique({
                    where: { id: existingVariant.productId },
                });
                if (product === null || product === void 0 ? void 0 : product.categoryId) {
                    const requiredAttributes = yield database_config_1.default.categoryAttribute.findMany({
                        where: { categoryId: product.categoryId, isRequired: true },
                        select: { attributeId: true },
                    });
                    const requiredAttributeIds = requiredAttributes.map((attr) => attr.attributeId);
                    const variantAttributeIds = data.attributes.map((attr) => attr.attributeId);
                    const missingAttributes = requiredAttributeIds.filter((id) => !variantAttributeIds.includes(id));
                    if (missingAttributes.length > 0) {
                        throw new AppError_1.default(400, `Variant is missing required attributes: ${missingAttributes.join(", ")}`);
                    }
                }
                const allAttributeIds = [
                    ...new Set(data.attributes.map((a) => a.attributeId)),
                ];
                const existingAttributes = yield database_config_1.default.attribute.findMany({
                    where: { id: { in: allAttributeIds } },
                });
                if (existingAttributes.length !== allAttributeIds.length) {
                    throw new AppError_1.default(400, "One or more attributes are invalid");
                }
                const allValueIds = [...new Set(data.attributes.map((a) => a.valueId))];
                const existingValues = yield database_config_1.default.attributeValue.findMany({
                    where: { id: { in: allValueIds } },
                });
                if (existingValues.length !== allValueIds.length) {
                    throw new AppError_1.default(400, "One or more attribute values are invalid");
                }
                if (new Set(allAttributeIds).size !== allAttributeIds.length) {
                    throw new AppError_1.default(400, "Duplicate attributes in variant");
                }
                const existingVariants = yield database_config_1.default.productVariant.findMany({
                    where: { productId: existingVariant.productId, id: { not: variantId } },
                    include: { attributes: true },
                });
                const newComboKey = data.attributes
                    .map((a) => `${a.attributeId}:${a.valueId}`)
                    .sort()
                    .join("|");
                const isDuplicateCombo = existingVariants.some((v) => v.attributes
                    .map((a) => `${a.attributeId}:${a.valueId}`)
                    .sort()
                    .join("|") === newComboKey);
                if (isDuplicateCombo) {
                    throw new AppError_1.default(400, "Duplicate attribute combination for this product");
                }
            }
            return this.variantRepository.updateVariant(variantId, data);
        });
    }
    restockVariant(variantId, quantity, notes, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (quantity <= 0) {
                throw new AppError_1.default(400, "Quantity must be positive");
            }
            const existingVariant = yield this.variantRepository.findVariantById(variantId);
            if (!existingVariant) {
                throw new AppError_1.default(404, "Variant not found");
            }
            return database_config_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const restock = yield this.variantRepository.createRestock({
                    variantId,
                    quantity,
                    notes,
                    userId,
                });
                yield this.variantRepository.updateVariantStock(variantId, quantity);
                yield this.variantRepository.createStockMovement({
                    variantId,
                    quantity,
                    reason: "restock",
                    userId,
                });
                const updatedVariant = yield this.variantRepository.findVariantById(variantId);
                const isLowStock = (updatedVariant === null || updatedVariant === void 0 ? void 0 : updatedVariant.stock) && updatedVariant.lowStockThreshold
                    ? updatedVariant.stock <= updatedVariant.lowStockThreshold
                    : false;
                return { restock, isLowStock };
            }));
        });
    }
    deleteVariant(variantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const variant = yield this.variantRepository.findVariantById(variantId);
            if (!variant) {
                throw new AppError_1.default(404, "Variant not found");
            }
            yield this.variantRepository.deleteVariant(variantId);
        });
    }
}
exports.VariantService = VariantService;
