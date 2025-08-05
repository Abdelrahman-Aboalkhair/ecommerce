"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUserController = void 0;
const user_repository_1 = require("./user.repository");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const makeUserController = () => {
    const repository = new user_repository_1.UserRepository();
    const service = new user_service_1.UserService(repository);
    return new user_controller_1.UserController(service);
};
exports.makeUserController = makeUserController;
