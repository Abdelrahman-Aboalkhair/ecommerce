"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAttributeController = void 0;
const attribute_controller_1 = require("./attribute.controller");
const attribute_repository_1 = require("./attribute.repository");
const attribute_service_1 = require("./attribute.service");
const makeAttributeController = () => {
    const repo = new attribute_repository_1.AttributeRepository();
    const service = new attribute_service_1.AttributeService(repo);
    const controller = new attribute_controller_1.AttributeController(service);
    return controller;
};
exports.makeAttributeController = makeAttributeController;
