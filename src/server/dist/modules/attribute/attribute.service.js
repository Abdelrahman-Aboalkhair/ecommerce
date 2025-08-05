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
exports.AttributeService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const slugify_1 = __importDefault(require("@/shared/utils/slugify"));
const ApiFeatures_1 = __importDefault(require("@/shared/utils/ApiFeatures"));
class AttributeService {
    constructor(attributeRepository) {
        this.attributeRepository = attributeRepository;
    }
    createAttribute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const slug = (0, slugify_1.default)(data.name);
            return yield this.attributeRepository.createAttribute(Object.assign(Object.assign({}, data), { slug }));
        });
    }
    createAttributeValue(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const slug = (0, slugify_1.default)(data.value);
            return yield this.attributeRepository.createAttributeValue(Object.assign(Object.assign({}, data), { slug }));
        });
    }
    assignAttributeToCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.attributeRepository.assignAttributeToCategory(data);
        });
    }
    // async assignAttributeToProduct(data: {
    //   productId: string;
    //   attributeId: string;
    //   valueId?: string;
    //   customValue?: string;
    // }) {
    //   return await this.attributeRepository.assignAttributeToProduct(data);
    // }
    getAllAttributes(queryString) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiFeatures = new ApiFeatures_1.default(queryString)
                .filter()
                .sort()
                .limitFields()
                .paginate()
                .build();
            return yield this.attributeRepository.findManyAttributes(apiFeatures);
        });
    }
    getAttribute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const attribute = yield this.attributeRepository.findAttributeById(id);
            if (!attribute) {
                throw new AppError_1.default(404, "Attribute not found");
            }
            return attribute;
        });
    }
    deleteAttribute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const attribute = yield this.attributeRepository.findAttributeById(id);
            if (!attribute) {
                throw new AppError_1.default(404, "Attribute not found");
            }
            yield this.attributeRepository.deleteAttribute(id);
        });
    }
    deleteAttributeValue(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const attributeValue = yield this.attributeRepository.findAttributeValueById(id);
            if (!attributeValue) {
                throw new AppError_1.default(404, "Attribute value not found");
            }
            yield this.attributeRepository.deleteAttributeValue(id);
        });
    }
}
exports.AttributeService = AttributeService;
