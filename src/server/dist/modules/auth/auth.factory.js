"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAuthController = void 0;
const auth_repository_1 = require("./auth.repository");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const makeAuthController = () => {
    const repository = new auth_repository_1.AuthRepository();
    const service = new auth_service_1.AuthService(repository);
    return new auth_controller_1.AuthController(service);
};
exports.makeAuthController = makeAuthController;
