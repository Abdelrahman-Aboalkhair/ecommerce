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
exports.SectionService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class SectionService {
    constructor(sectionRepository) {
        this.sectionRepository = sectionRepository;
    }
    getAllSections() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sectionRepository.findAll();
        });
    }
    findHero() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sectionRepository.findHero();
        });
    }
    findPromo() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sectionRepository.findPromo();
        });
    }
    findBenefits() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sectionRepository.findBenefits();
        });
    }
    findArrivals() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sectionRepository.findArrivals();
        });
    }
    createSection(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sectionRepository.create(data);
        });
    }
    getSectionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const section = yield this.sectionRepository.findById(id);
            if (!section)
                throw new AppError_1.default(404, "Section not found");
            return section;
        });
    }
    updateSection(type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sectionRepository.update(type, data);
        });
    }
    deleteSection(type) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sectionRepository.deleteByType(type);
        });
    }
}
exports.SectionService = SectionService;
