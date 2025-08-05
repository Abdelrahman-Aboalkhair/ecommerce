"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeProductController = void 0;
const product_repository_1 = require("./product.repository");
const product_service_1 = require("./product.service");
const product_controller_1 = require("./product.controller");
const attribute_repository_1 = require("../attribute/attribute.repository");
const variant_repository_1 = require("../variant/variant.repository");
const makeProductController = () => {
    const productRepository = new product_repository_1.ProductRepository();
    const attrRepository = new attribute_repository_1.AttributeRepository();
    const variantRepository = new variant_repository_1.VariantRepository();
    const service = new product_service_1.ProductService(productRepository, attrRepository, variantRepository);
    return new product_controller_1.ProductController(service);
};
exports.makeProductController = makeProductController;
