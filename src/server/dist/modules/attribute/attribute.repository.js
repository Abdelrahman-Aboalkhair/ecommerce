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
exports.AttributeRepository = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class AttributeRepository {
    createAttribute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.attribute.create({ data });
        });
    }
    createAttributeValue(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.attributeValue.create({ data });
        });
    }
    assignAttributeToCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.categoryAttribute.create({ data });
        });
    }
    // async assignAttributeToProduct(data: {
    //   productId: string;
    //   attributeId: string;
    //   valueId?: string;
    //   customValue?: string;
    // }) {
    //   return prisma.productAttribute.create({ data });
    // }
    findManyAttributes(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { where, orderBy = { createdAt: "desc" }, skip = 0, take = 10, } = params;
            return database_config_1.default.attribute.findMany({
                where,
                orderBy,
                skip,
                take,
                include: { values: true, categories: { include: { category: true } } },
            });
        });
    }
    findAttributeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.attribute.findUnique({
                where: { id },
                include: { values: true },
            });
        });
    }
    findAttributeValueById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.attributeValue.findUnique({
                where: { id },
                include: { attribute: true },
            });
        });
    }
    deleteAttribute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.attribute.delete({ where: { id } });
        });
    }
    deleteAttributeValue(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.attributeValue.delete({ where: { id } });
        });
    }
}
exports.AttributeRepository = AttributeRepository;
