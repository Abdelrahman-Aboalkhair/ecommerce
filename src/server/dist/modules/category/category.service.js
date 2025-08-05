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
exports.CategoryService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const slugify_1 = __importDefault(require("@/shared/utils/slugify"));
const ApiFeatures_1 = __importDefault(require("@/shared/utils/ApiFeatures"));
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    getAllCategories(queryString) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiFeatures = new ApiFeatures_1.default(queryString)
                .filter()
                .sort()
                .limitFields()
                .paginate()
                .build();
            const { where, orderBy, skip, take } = apiFeatures;
            const categories = yield this.categoryRepository.findManyCategories({
                where,
                orderBy,
                skip,
                take,
                includeProducts: true,
            });
            // const categoriesWithCounts = categories.map((category) => ({
            //   ...category,
            //   productCount: category.products?.length || 0,
            //   variantCount: category.products?.reduce((sum, product) => sum + (product.variants?.length || 0), 0) || 0,
            // }));
            return categories;
        });
    }
    getCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const category = yield this.categoryRepository.findCategoryById(categoryId, true);
            if (!category) {
                throw new AppError_1.default(404, "Category not found");
            }
            return Object.assign(Object.assign({}, category), { productCount: ((_a = category.products) === null || _a === void 0 ? void 0 : _a.length) || 0 });
        });
    }
    createCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const slug = (0, slugify_1.default)(data.name);
            const existingCategory = yield database_config_1.default.category.findUnique({ where: { slug } });
            if (existingCategory) {
                throw new AppError_1.default(400, "Category with this name already exists");
            }
            // Validate attributes
            if (data.attributes) {
                for (const attr of data.attributes) {
                    const attribute = yield database_config_1.default.attribute.findUnique({ where: { id: attr.attributeId } });
                    if (!attribute) {
                        throw new AppError_1.default(404, `Attribute not found: ${attr.attributeId}`);
                    }
                }
            }
            const category = yield this.categoryRepository.createCategory({
                name: data.name,
                slug,
                description: data.description,
                images: data.images,
                attributes: data.attributes,
            });
            return { category };
        });
    }
    updateCategory(categoryId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryRepository.findCategoryById(categoryId);
            if (!category) {
                throw new AppError_1.default(404, "Category not found");
            }
            const slug = data.name ? (0, slugify_1.default)(data.name) : undefined;
            if (slug && slug !== category.slug) {
                const existingCategory = yield database_config_1.default.category.findUnique({ where: { slug } });
                if (existingCategory) {
                    throw new AppError_1.default(400, "Category with this name already exists");
                }
            }
            const updatedCategory = yield this.categoryRepository.updateCategory(categoryId, {
                name: data.name,
                slug,
                description: data.description,
                images: data.images,
            });
            return { category: updatedCategory };
        });
    }
    deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryRepository.findCategoryById(categoryId);
            if (!category) {
                throw new AppError_1.default(404, "Category not found");
            }
            yield this.categoryRepository.deleteCategory(categoryId);
        });
    }
    addCategoryAttribute(categoryId, attributeId, isRequired) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryRepository.findCategoryById(categoryId);
            if (!category) {
                throw new AppError_1.default(404, "Category not found");
            }
            const attribute = yield database_config_1.default.attribute.findUnique({ where: { id: attributeId } });
            if (!attribute) {
                throw new AppError_1.default(404, "Attribute not found");
            }
            const existing = yield database_config_1.default.categoryAttribute.findUnique({
                where: { categoryId_attributeId: { categoryId, attributeId } },
            });
            if (existing) {
                throw new AppError_1.default(400, "Attribute already assigned to category");
            }
            const categoryAttribute = yield this.categoryRepository.addCategoryAttribute(categoryId, attributeId, isRequired);
            return { categoryAttribute };
        });
    }
    removeCategoryAttribute(categoryId, attributeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryRepository.findCategoryById(categoryId);
            if (!category) {
                throw new AppError_1.default(404, "Category not found");
            }
            const attribute = yield database_config_1.default.attribute.findUnique({ where: { id: attributeId } });
            if (!attribute) {
                throw new AppError_1.default(404, "Attribute not found");
            }
            yield this.categoryRepository.removeCategoryAttribute(categoryId, attributeId);
        });
    }
}
exports.CategoryService = CategoryService;
