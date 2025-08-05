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
exports.CategoryRepository = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class CategoryRepository {
    findManyCategories(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { where, orderBy, skip, take, includeProducts } = params;
            return database_config_1.default.category.findMany({
                where,
                orderBy: orderBy || { createdAt: "desc" },
                skip,
                take,
                include: {
                    attributes: { include: { attribute: { include: { values: true } } } },
                    products: includeProducts
                        ? { include: { variants: { select: { id: true, sku: true, price: true, stock: true } } } }
                        : false,
                },
            });
        });
    }
    findCategoryById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, includeProducts = false) {
            return database_config_1.default.category.findUnique({
                where: { id },
                include: {
                    attributes: { include: { attribute: { include: { values: true } } } },
                    products: includeProducts
                        ? { include: { variants: { select: { id: true, sku: true, price: true, stock: true } } } }
                        : false,
                },
            });
        });
    }
    createCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.category.create({
                data: {
                    name: data.name,
                    slug: data.slug,
                    description: data.description,
                    images: data.images,
                    attributes: data.attributes
                        ? {
                            create: data.attributes.map((attr) => ({
                                attributeId: attr.attributeId,
                                isRequired: attr.isRequired,
                            })),
                        }
                        : undefined,
                },
            });
        });
    }
    updateCategory(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.category.update({
                where: { id },
                data,
            });
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.category.delete({
                where: { id },
            });
        });
    }
    addCategoryAttribute(categoryId, attributeId, isRequired) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.categoryAttribute.create({
                data: {
                    categoryId,
                    attributeId,
                    isRequired,
                },
            });
        });
    }
    removeCategoryAttribute(categoryId, attributeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.categoryAttribute.delete({
                where: { categoryId_attributeId: { categoryId, attributeId } },
            });
        });
    }
}
exports.CategoryRepository = CategoryRepository;
