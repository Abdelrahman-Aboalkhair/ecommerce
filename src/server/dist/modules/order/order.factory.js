"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOrderController = void 0;
const order_repository_1 = require("./order.repository");
const order_service_1 = require("./order.service");
const order_controller_1 = require("./order.controller");
const makeOrderController = () => {
    const repository = new order_repository_1.OrderRepository();
    const service = new order_service_1.OrderService(repository);
    return new order_controller_1.OrderController(service);
};
exports.makeOrderController = makeOrderController;
