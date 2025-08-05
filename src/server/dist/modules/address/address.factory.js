"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAddressController = void 0;
const address_repository_1 = require("./address.repository");
const address_service_1 = require("./address.service");
const address_controller_1 = require("./address.controller");
const makeAddressController = () => {
    const repository = new address_repository_1.AddressRepository();
    const service = new address_service_1.AddressService(repository);
    return new address_controller_1.AddressController(service);
};
exports.makeAddressController = makeAddressController;
