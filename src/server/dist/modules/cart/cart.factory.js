"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCartController = void 0;
const cart_repository_1 = require("./cart.repository");
const cart_service_1 = require("./cart.service");
const cart_controller_1 = require("./cart.controller");
const makeCartController = () => {
    const repository = new cart_repository_1.CartRepository();
    const service = new cart_service_1.CartService(repository);
    return new cart_controller_1.CartController(service);
};
exports.makeCartController = makeCartController;
