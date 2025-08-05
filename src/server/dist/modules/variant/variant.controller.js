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
exports.VariantController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const logs_factory_1 = require("../logs/logs.factory");
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const uploadToCloudinary_1 = require("@/shared/utils/uploadToCloudinary");
class VariantController {
    constructor(variantService) {
        this.variantService = variantService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.getAllVariants = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { variants, totalResults, totalPages, currentPage, resultsPerPage, } = yield this.variantService.getAllVariants(req.query);
            (0, sendResponse_1.default)(res, 200, {
                data: {
                    variants,
                    totalResults,
                    totalPages,
                    currentPage,
                    resultsPerPage,
                },
                message: "Variants fetched successfully",
            });
        }));
        this.getRestockHistory = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id: variantId } = req.params;
            const { page = "1", limit = "10" } = req.query;
            const { restocks, totalResults, totalPages, currentPage, resultsPerPage, } = yield this.variantService.getRestockHistory(variantId, parseInt(page), parseInt(limit));
            (0, sendResponse_1.default)(res, 200, {
                data: {
                    restocks,
                    totalResults,
                    totalPages,
                    currentPage,
                    resultsPerPage,
                },
                message: "Restock history fetched successfully",
            });
        }));
        this.getVariantById = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id: variantId } = req.params;
            const variant = yield this.variantService.getVariantById(variantId);
            (0, sendResponse_1.default)(res, 200, {
                data: { variant },
                message: "Variant fetched successfully",
            });
        }));
        this.getVariantBySku = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { sku } = req.params;
            const variant = yield this.variantService.getVariantBySku(sku);
            (0, sendResponse_1.default)(res, 200, {
                data: { variant },
                message: "Variant fetched successfully",
            });
        }));
        this.createVariant = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { productId, sku, price, stock, lowStockThreshold, barcode, warehouseLocation, attributes, } = req.body;
            let parsedAttributes;
            try {
                parsedAttributes =
                    typeof attributes === "string" ? JSON.parse(attributes) : attributes;
                if (!Array.isArray(parsedAttributes)) {
                    throw new AppError_1.default(400, "Attributes must be an array");
                }
                parsedAttributes.forEach((attr, index) => {
                    if (!attr.attributeId || !attr.valueId) {
                        throw new AppError_1.default(400, `Invalid attribute structure at index ${index}`);
                    }
                });
                const attributeIds = parsedAttributes.map((attr) => attr.attributeId);
                if (new Set(attributeIds).size !== attributeIds.length) {
                    throw new AppError_1.default(400, "Duplicate attributes in variant");
                }
            }
            catch (error) {
                throw new AppError_1.default(400, "Invalid attributes format");
            }
            console.log("req.files: ", req.files);
            const files = req.files;
            let imageUrls = [];
            if (Array.isArray(files) && files.length > 0) {
                const uploadedImages = yield (0, uploadToCloudinary_1.uploadToCloudinary)(files);
                imageUrls = uploadedImages.map((img) => img.url).filter(Boolean);
            }
            const variant = yield this.variantService.createVariant({
                productId,
                sku,
                price: Number(price),
                stock: Number(stock),
                lowStockThreshold: lowStockThreshold
                    ? Number(lowStockThreshold)
                    : undefined,
                barcode,
                warehouseLocation,
                images: imageUrls,
                attributes: parsedAttributes,
            });
            (0, sendResponse_1.default)(res, 201, {
                data: { variant },
                message: "Variant created successfully",
            });
            this.logsService.info("Variant created", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
            });
        }));
        this.updateVariant = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id: variantId } = req.params;
            const { sku, price, stock, lowStockThreshold, barcode, warehouseLocation, attributes, } = req.body;
            let parsedAttributes;
            if (attributes) {
                try {
                    parsedAttributes =
                        typeof attributes === "string"
                            ? JSON.parse(attributes)
                            : attributes;
                    if (!Array.isArray(parsedAttributes)) {
                        throw new AppError_1.default(400, "Attributes must be an array");
                    }
                    parsedAttributes.forEach((attr, index) => {
                        if (!attr.attributeId || !attr.valueId) {
                            throw new AppError_1.default(400, `Invalid attribute structure at index ${index}`);
                        }
                    });
                    const attributeIds = parsedAttributes.map((attr) => attr.attributeId);
                    if (new Set(attributeIds).size !== attributeIds.length) {
                        throw new AppError_1.default(400, "Duplicate attributes in variant");
                    }
                }
                catch (error) {
                    throw new AppError_1.default(400, "Invalid attributes format");
                }
            }
            const files = req.files;
            let imageUrls = [];
            if (Array.isArray(files) && files.length > 0) {
                const uploadedImages = yield (0, uploadToCloudinary_1.uploadToCloudinary)(files);
                imageUrls = uploadedImages.map((img) => img.url).filter(Boolean);
            }
            const variant = yield this.variantService.updateVariant(variantId, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (sku && { sku })), (price !== undefined && { price: Number(price) })), (stock !== undefined && { stock: Number(stock) })), (lowStockThreshold !== undefined && {
                lowStockThreshold: Number(lowStockThreshold),
            })), (barcode !== undefined && { barcode })), (warehouseLocation !== undefined && { warehouseLocation })), (imageUrls.length > 0 && { images: imageUrls })), (parsedAttributes && { attributes: parsedAttributes })));
            (0, sendResponse_1.default)(res, 200, {
                data: { variant },
                message: "Variant updated successfully",
            });
            this.logsService.info("Variant updated", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
            });
        }));
        this.restockVariant = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { id: variantId } = req.params;
            const { quantity, notes } = req.body;
            console.log("req.body: ", req.body);
            const parsedQuantity = Number(quantity);
            if (!quantity || isNaN(parsedQuantity) || parsedQuantity <= 0) {
                throw new AppError_1.default(400, "Valid positive quantity is required");
            }
            const { restock, isLowStock } = yield this.variantService.restockVariant(variantId, parsedQuantity, notes, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            (0, sendResponse_1.default)(res, 200, {
                data: { restock, isLowStock },
                message: "Variant restocked successfully",
            });
            this.logsService.info("Variant restocked", {
                userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
                sessionId: req.session.id,
            });
        }));
        this.deleteVariant = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id: variantId } = req.params;
            yield this.variantService.deleteVariant(variantId);
            (0, sendResponse_1.default)(res, 200, { message: "Variant deleted successfully" });
            this.logsService.info("Variant deleted", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
            });
        }));
    }
}
exports.VariantController = VariantController;
