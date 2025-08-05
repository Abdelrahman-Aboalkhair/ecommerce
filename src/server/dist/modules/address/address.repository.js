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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressRepository = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class AddressRepository {
    createAddress(data, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            return tx === null || tx === void 0 ? void 0 : tx.address.create({
                data: {
                    orderId: data.orderId,
                    userId: data.userId,
                    city: data.city,
                    state: data.state,
                    street: data.street,
                    country: data.country,
                    zip: data.zip,
                },
            });
        });
    }
    findAddressesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.address.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
            });
        });
    }
    findAddressById(addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.address.findUnique({
                where: { id: addressId },
            });
        });
    }
    deleteAddress(addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.address.delete({
                where: { id: addressId },
            });
        });
    }
}
exports.AddressRepository = AddressRepository;
