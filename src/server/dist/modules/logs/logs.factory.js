"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLogsService = exports.makeLogsController = void 0;
const logs_controller_1 = require("./logs.controller");
const logs_repository_1 = require("./logs.repository");
const logs_service_1 = require("./logs.service");
const makeLogsController = () => {
    const logsRepo = new logs_repository_1.LogsRepository();
    const service = new logs_service_1.LogsService(logsRepo);
    const controller = new logs_controller_1.LogsController(service);
    return controller;
};
exports.makeLogsController = makeLogsController;
const makeLogsService = () => {
    const logsRepo = new logs_repository_1.LogsRepository();
    const service = new logs_service_1.LogsService(logsRepo);
    return service;
};
exports.makeLogsService = makeLogsService;
