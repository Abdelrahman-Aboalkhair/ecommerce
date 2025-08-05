"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ProductService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const ApiFeatures_1 = __importDefault(require("@/shared/utils/ApiFeatures"));
const slugify_1 = __importDefault(require("@/shared/utils/slugify"));
const sync_1 = require("csv-parse/sync");
const XLSX = __importStar(require("xlsx"));
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class ProductService {
    constructor(productRepository, attributeRepository, variantRepository) {
        this.productRepository = productRepository;
        this.attributeRepository = attributeRepository;
        this.variantRepository = variantRepository;
    }
    getAllProducts(queryString) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiFeatures = new ApiFeatures_1.default(queryString)
                .filter()
                .sort()
                .limitFields()
                .paginate()
                .build();
            const { where, orderBy, skip, take, select } = apiFeatures;
            const finalWhere = where && Object.keys(where).length > 0 ? where : {};
            const totalResults = yield this.productRepository.countProducts({
                where: finalWhere,
            });
            const totalPages = Math.ceil(totalResults / take);
            const currentPage = Math.floor(skip / take) + 1;
            const products = yield this.productRepository.findManyProducts({
                where: finalWhere,
                orderBy: orderBy || { createdAt: "desc" },
                skip,
                take,
                select,
            });
            return {
                products,
                totalResults,
                totalPages,
                currentPage,
                resultsPerPage: take,
            };
        });
    }
    getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepository.findProductById(productId);
            if (!product) {
                throw new AppError_1.default(404, "Product not found");
            }
            return product;
        });
    }
    getProductBySlug(productSlug) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepository.findProductBySlug(productSlug);
            if (!product) {
                throw new AppError_1.default(404, "Product not found");
            }
            return product;
        });
    }
    createProduct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { variants } = data, productData = __rest(data, ["variants"]);
            if (!variants || variants.length === 0) {
                throw new AppError_1.default(400, "At least one variant is required");
            }
            // Validate SKU format (alphanumeric with dashes, 3-50 characters)
            const skuRegex = /^[a-zA-Z0-9-]+$/;
            variants.forEach((variant, index) => {
                if (!variant.sku ||
                    !skuRegex.test(variant.sku) ||
                    variant.sku.length < 3 ||
                    variant.sku.length > 50) {
                    throw new AppError_1.default(400, `Variant at index ${index} has invalid SKU. Use alphanumeric characters and dashes, 3-50 characters.`);
                }
                if (variant.price <= 0) {
                    throw new AppError_1.default(400, `Variant at index ${index} must have a positive price`);
                }
                if (variant.stock < 0) {
                    throw new AppError_1.default(400, `Variant at index ${index} must have non-negative stock`);
                }
                if (variant.lowStockThreshold && variant.lowStockThreshold < 0) {
                    throw new AppError_1.default(400, `Variant at index ${index} must have non-negative lowStockThreshold`);
                }
            });
            // Validate category and required attributes
            let requiredAttributeIds = [];
            if (productData.categoryId) {
                const category = yield database_config_1.default.category.findUnique({
                    where: { id: productData.categoryId },
                    include: {
                        attributes: {
                            where: { isRequired: true },
                            select: { attributeId: true },
                        },
                    },
                });
                if (!category) {
                    throw new AppError_1.default(404, "Category not found");
                }
                requiredAttributeIds = category.attributes.map((attr) => attr.attributeId);
            }
            // Validate attributes and values in one query
            const allAttributeIds = [
                ...new Set(variants.flatMap((v) => v.attributes.map((a) => a.attributeId))),
            ];
            const allValueIds = [
                ...new Set(variants.flatMap((v) => v.attributes.map((a) => a.valueId))),
            ];
            const [existingAttributes, existingValues] = yield Promise.all([
                database_config_1.default.attribute.findMany({
                    where: { id: { in: allAttributeIds } },
                    select: { id: true },
                }),
                database_config_1.default.attributeValue.findMany({
                    where: { id: { in: allValueIds } },
                    select: { id: true, attributeId: true },
                }),
            ]);
            if (existingAttributes.length !== allAttributeIds.length) {
                throw new AppError_1.default(400, "One or more attribute IDs are invalid");
            }
            if (existingValues.length !== allValueIds.length) {
                throw new AppError_1.default(400, "One or more attribute value IDs are invalid");
            }
            // Validate attribute-value pairs
            variants.forEach((variant, index) => {
                variant.attributes.forEach((attr, attrIndex) => {
                    const value = existingValues.find((v) => v.id === attr.valueId);
                    if (!value || value.attributeId !== attr.attributeId) {
                        throw new AppError_1.default(400, `Attribute value at variant index ${index}, attribute index ${attrIndex} does not belong to the specified attribute`);
                    }
                });
            });
            // Validate unique SKUs
            const existingSkus = yield database_config_1.default.productVariant.findMany({
                where: { sku: { in: variants.map((v) => v.sku) } },
                select: { sku: true },
            });
            if (existingSkus.length > 0) {
                throw new AppError_1.default(400, `Duplicate SKUs detected: ${existingSkus.map((s) => s.sku).join(", ")}`);
            }
            // Validate unique attribute combinations
            const comboKeys = variants.map((variant) => variant.attributes
                .map((attr) => `${attr.attributeId}:${attr.valueId}`)
                .sort()
                .join("|"));
            if (new Set(comboKeys).size !== variants.length) {
                throw new AppError_1.default(400, "Duplicate attribute combinations detected");
            }
            // Validate required attributes
            variants.forEach((variant, index) => {
                const variantAttributeIds = variant.attributes.map((attr) => attr.attributeId);
                const missingAttributes = requiredAttributeIds.filter((id) => !variantAttributeIds.includes(id));
                if (missingAttributes.length > 0) {
                    throw new AppError_1.default(400, `Variant at index ${index} is missing required attributes: ${missingAttributes.join(", ")}`);
                }
            });
            // Create product and variants in a transaction
            return database_config_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const product = yield this.productRepository.createProduct(Object.assign(Object.assign({}, productData), { slug: (0, slugify_1.default)(productData.name) }));
                for (const variant of variants) {
                    yield this.variantRepository.createVariant({
                        productId: product.id,
                        sku: variant.sku,
                        price: variant.price,
                        stock: variant.stock,
                        lowStockThreshold: variant.lowStockThreshold || 10,
                        barcode: variant.barcode,
                        warehouseLocation: variant.warehouseLocation,
                        attributes: variant.attributes,
                        images: variant.images || [],
                    });
                }
                return this.productRepository.findProductById(product.id);
            }));
        });
    }
    updateProduct(productId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingProduct = yield this.productRepository.findProductById(productId);
            if (!existingProduct) {
                throw new AppError_1.default(404, "Product not found");
            }
            const { variants } = updatedData, productData = __rest(updatedData, ["variants"]);
            // Validate variants if provided
            if (variants) {
                if (variants.length === 0) {
                    throw new AppError_1.default(400, "At least one variant is required");
                }
                const skuRegex = /^[a-zA-Z0-9-]+$/;
                variants.forEach((variant, index) => {
                    if (!variant.sku ||
                        !skuRegex.test(variant.sku) ||
                        variant.sku.length < 3 ||
                        variant.sku.length > 50) {
                        throw new AppError_1.default(400, `Variant at index ${index} has an invalid SKU. Use alphanumeric characters and dashes, 3-50 characters.`);
                    }
                    if (variant.price <= 0) {
                        throw new AppError_1.default(400, `Variant at index ${index} must have a positive price`);
                    }
                    if (variant.stock < 0) {
                        throw new AppError_1.default(400, `Variant at index ${index} must have a non-negative stock`);
                    }
                    if (variant.lowStockThreshold && variant.lowStockThreshold < 0) {
                        throw new AppError_1.default(400, `Variant at index ${index} must have a non-negative lowStockThreshold`);
                    }
                });
                const allAttributeIds = [
                    ...new Set(variants.flatMap((v) => v.attributes.map((a) => a.attributeId))),
                ];
                const existingAttributes = yield database_config_1.default.attribute.findMany({
                    where: { id: { in: allAttributeIds } },
                });
                if (existingAttributes.length !== allAttributeIds.length) {
                    throw new AppError_1.default(400, "One or more attributes are invalid");
                }
                const allValueIds = [
                    ...new Set(variants.flatMap((v) => v.attributes.map((a) => a.valueId))),
                ];
                const existingValues = yield database_config_1.default.attributeValue.findMany({
                    where: { id: { in: allValueIds } },
                });
                if (existingValues.length !== allValueIds.length) {
                    throw new AppError_1.default(400, "One or more attribute values are invalid");
                }
                const skuSet = new Set(variants.map((v) => v.sku));
                if (skuSet.size !== variants.length) {
                    throw new AppError_1.default(400, "Duplicate SKUs detected");
                }
                const comboKeys = variants.map((variant) => variant.attributes
                    .map((attr) => `${attr.attributeId}:${attr.valueId}`)
                    .sort()
                    .join("|"));
                if (new Set(comboKeys).size !== variants.length) {
                    throw new AppError_1.default(400, "Duplicate attribute combinations detected");
                }
                const categoryId = productData.categoryId || existingProduct.categoryId;
                let requiredAttributeIds = [];
                if (categoryId) {
                    const requiredAttributes = yield database_config_1.default.categoryAttribute.findMany({
                        where: { categoryId, isRequired: true },
                        select: { attributeId: true },
                    });
                    requiredAttributeIds = requiredAttributes.map((attr) => attr.attributeId);
                }
                variants.forEach((variant, index) => {
                    const variantAttributeIds = variant.attributes.map((attr) => attr.attributeId);
                    const missingAttributes = requiredAttributeIds.filter((id) => !variantAttributeIds.includes(id));
                    if (missingAttributes.length > 0) {
                        throw new AppError_1.default(400, `Variant at index ${index} is missing required attributes: ${missingAttributes.join(", ")}`);
                    }
                });
            }
            return database_config_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const updatedProduct = yield this.productRepository.updateProduct(productId, Object.assign(Object.assign({}, productData), (productData.name && { slug: (0, slugify_1.default)(productData.name) })));
                if (variants) {
                    yield database_config_1.default.productVariant.deleteMany({ where: { productId } });
                    for (const variant of variants) {
                        yield this.variantRepository.createVariant({
                            productId,
                            sku: variant.sku,
                            price: variant.price,
                            stock: variant.stock,
                            lowStockThreshold: variant.lowStockThreshold || 10,
                            barcode: variant.barcode,
                            warehouseLocation: variant.warehouseLocation,
                            attributes: variant.attributes,
                            images: variant.images || [],
                        });
                    }
                }
                return this.productRepository.findProductById(productId);
            }));
        });
    }
    bulkCreateProducts(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file) {
                throw new AppError_1.default(400, "No file uploaded");
            }
            let records;
            try {
                if (file.mimetype === "text/csv") {
                    records = (0, sync_1.parse)(file.buffer.toString(), {
                        columns: true,
                        skip_empty_lines: true,
                        trim: true,
                    });
                }
                else if (file.mimetype ===
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    const workbook = XLSX.read(file.buffer, { type: "buffer" });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    records = XLSX.utils.sheet_to_json(sheet);
                }
                else {
                    throw new AppError_1.default(400, "Unsupported file format. Use CSV or XLSX");
                }
            }
            catch (error) {
                throw new AppError_1.default(400, "Failed to parse file");
            }
            if (records.length === 0) {
                throw new AppError_1.default(400, "File is empty");
            }
            const products = records.map((record) => {
                if (!record.name || !record.basePrice) {
                    throw new AppError_1.default(400, `Invalid record: ${JSON.stringify(record)}`);
                }
                return {
                    name: String(record.name),
                    slug: (0, slugify_1.default)(record.name),
                    description: record.description
                        ? String(record.description)
                        : undefined,
                    basePrice: Number(record.basePrice),
                    discount: record.discount ? Number(record.discount) : 0,
                    isNew: record.isNew ? Boolean(record.isNew) : false,
                    isTrending: record.isTrending ? Boolean(record.isTrending) : false,
                    isBestSeller: record.isBestSeller
                        ? Boolean(record.isBestSeller)
                        : false,
                    isFeatured: record.isFeatured ? Boolean(record.isFeatured) : false,
                    categoryId: record.categoryId ? String(record.categoryId) : undefined,
                };
            });
            const categoryIds = products
                .filter((p) => p.categoryId)
                .map((p) => p.categoryId);
            if (categoryIds.length > 0) {
                const existingCategories = yield database_config_1.default.category.findMany({
                    where: { id: { in: categoryIds } },
                    select: { id: true },
                });
                const validCategoryIds = new Set(existingCategories.map((c) => c.id));
                for (const product of products) {
                    if (product.categoryId && !validCategoryIds.has(product.categoryId)) {
                        throw new AppError_1.default(400, `Invalid categoryId: ${product.categoryId}`);
                    }
                }
            }
            yield this.productRepository.createManyProducts(products);
            return { count: products.length };
        });
    }
    deleteProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepository.findProductById(productId);
            if (!product) {
                throw new AppError_1.default(404, "Product not found");
            }
            yield this.productRepository.deleteProduct(productId);
        });
    }
}
exports.ProductService = ProductService;
