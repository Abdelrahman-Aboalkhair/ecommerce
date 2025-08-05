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
exports.AddressService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class AddressService {
    constructor(addressRepository) {
        this.addressRepository = addressRepository;
    }
    getUserAddresses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const addresses = yield this.addressRepository.findAddressesByUserId(userId);
            if (!addresses || addresses.length === 0) {
                throw new AppError_1.default(404, "No addresses found for this user");
            }
            return addresses;
        });
    }
    getAddressDetails(addressId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.addressRepository.findAddressById(addressId);
            if (!address) {
                throw new AppError_1.default(404, "Address not found");
            }
            if (address.userId !== userId) {
                throw new AppError_1.default(403, "You are not authorized to view this address");
            }
            return address;
        });
    }
    deleteAddress(addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.addressRepository.findAddressById(addressId);
            if (!address) {
                throw new AppError_1.default(404, "Address not found");
            }
            return this.addressRepository.deleteAddress(addressId);
        });
    }
}
exports.AddressService = AddressService;
