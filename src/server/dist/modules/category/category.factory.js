"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCategoryController = void 0;
const category_repository_1 = require("./category.repository");
const category_service_1 = require("./category.service");
const category_controller_1 = require("./category.controller");
const makeCategoryController = () => {
    const repository = new category_repository_1.CategoryRepository();
    const service = new category_service_1.CategoryService(repository);
    return new category_controller_1.CategoryController(service);
};
exports.makeCategoryController = makeCategoryController;
