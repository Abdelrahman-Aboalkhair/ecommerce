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
const yearRange = {
    Query: {
        yearRange: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { prisma }) {
            var _b, _c;
            const orders = yield prisma.order.aggregate({
                _min: { orderDate: true },
                _max: { orderDate: true },
            });
            const minYear = ((_b = orders._min.orderDate) === null || _b === void 0 ? void 0 : _b.getFullYear()) || new Date().getFullYear();
            const maxYear = ((_c = orders._max.orderDate) === null || _c === void 0 ? void 0 : _c.getFullYear()) || new Date().getFullYear();
            return { minYear, maxYear };
        }),
    },
};
exports.default = yearRange;
