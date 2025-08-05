"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRequest = void 0;
const logs_factory_1 = require("@/modules/logs/logs.factory");
const logsService = (0, logs_factory_1.makeLogsService)();
const logRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const start = Date.now();
    const { method, url, ip } = req;
    res.on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const duration = Date.now() - start;
        const status = res.statusCode;
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || "anonymous";
        yield logsService.info(`API Request`, {
            method,
            url,
            status,
            timePeriod: duration,
            ip,
            userId,
        });
    }));
    next();
});
exports.logRequest = logRequest;
