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
exports.CategoryController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const logs_factory_1 = require("../logs/logs.factory");
const uploadToCloudinary_1 = require("@/shared/utils/uploadToCloudinary");
const slugify_1 = __importDefault(require("@/shared/utils/slugify"));
class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.getAllCategories = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.categoryService.getAllCategories(req.query);
            (0, sendResponse_1.default)(res, 200, {
                data: { categories },
                message: "Categories fetched successfully",
            });
        }));
        this.getCategory = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id: categoryId } = req.params;
            const category = yield this.categoryService.getCategory(categoryId);
            (0, sendResponse_1.default)(res, 200, {
                data: { category },
                message: "Category fetched successfully",
            });
        }));
        this.createCategory = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { name, description } = req.body;
            const slugifiedName = (0, slugify_1.default)(name);
            const files = req.files;
            let imageUrls = [];
            if (Array.isArray(files) && files.length > 0) {
                const uploadedImages = yield (0, uploadToCloudinary_1.uploadToCloudinary)(files);
                imageUrls = uploadedImages.map((img) => img.url).filter(Boolean);
            }
            const { category } = yield this.categoryService.createCategory({
                name,
                description,
                images: imageUrls.length > 0 ? imageUrls : undefined,
            });
            (0, sendResponse_1.default)(res, 201, {
                data: { category },
                message: "Category created successfully",
            });
            const start = Date.now();
            const end = Date.now();
            this.logsService.info("Category created", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
                timePeriod: end - start,
            });
        }));
        this.deleteCategory = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id: categoryId } = req.params;
            yield this.categoryService.deleteCategory(categoryId);
            (0, sendResponse_1.default)(res, 204, { message: "Category deleted successfully" });
            const start = Date.now();
            const end = Date.now();
            this.logsService.info("Category deleted", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
                timePeriod: end - start,
            });
        }));
    }
}
exports.CategoryController = CategoryController;
