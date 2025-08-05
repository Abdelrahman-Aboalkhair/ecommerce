"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeShipmentController = void 0;
const shipment_repository_1 = require("./shipment.repository");
const shipment_service_1 = require("./shipment.service");
const shipment_controller_1 = require("./shipment.controller");
const makeShipmentController = () => {
    const repository = new shipment_repository_1.ShipmentRepository();
    const service = new shipment_service_1.ShipmentService(repository);
    return new shipment_controller_1.ShipmentController(service);
};
exports.makeShipmentController = makeShipmentController;
