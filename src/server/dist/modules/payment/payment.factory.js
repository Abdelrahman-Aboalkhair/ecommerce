"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePaymentController = void 0;
const payment_repository_1 = require("./payment.repository");
const payment_service_1 = require("./payment.service");
const payment_controller_1 = require("./payment.controller");
const makePaymentController = () => {
    const repository = new payment_repository_1.PaymentRepository();
    const service = new payment_service_1.PaymentService(repository);
    return new payment_controller_1.PaymentController(service);
};
exports.makePaymentController = makePaymentController;
