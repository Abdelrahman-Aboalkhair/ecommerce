"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeVariantController = void 0;
const variant_controller_1 = require("./variant.controller");
const variant_repository_1 = require("./variant.repository");
const attribute_repository_1 = require("../attribute/attribute.repository");
const variant_service_1 = require("./variant.service");
const makeVariantController = () => {
    const variantRepository = new variant_repository_1.VariantRepository();
    const attributeRepository = new attribute_repository_1.AttributeRepository();
    const variantService = new variant_service_1.VariantService(variantRepository, attributeRepository);
    return new variant_controller_1.VariantController(variantService);
};
exports.makeVariantController = makeVariantController;
