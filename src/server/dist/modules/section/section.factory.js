"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSectionController = void 0;
const section_controller_1 = require("./section.controller");
const section_repository_1 = require("./section.repository");
const section_service_1 = require("./section.service");
const makeSectionController = () => {
    const repo = new section_repository_1.SectionRepository();
    const service = new section_service_1.SectionService(repo);
    const controller = new section_controller_1.SectionController(service);
    return controller;
};
exports.makeSectionController = makeSectionController;
