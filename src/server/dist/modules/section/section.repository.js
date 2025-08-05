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
exports.SectionRepository = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class SectionRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.section.findMany();
        });
    }
    findHero() {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.section.findFirst({ where: { type: "HERO" } });
        });
    }
    findPromo() {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.section.findFirst({ where: { type: "PROMOTIONAL" } });
        });
    }
    findArrivals() {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.section.findFirst({ where: { type: "NEW_ARRIVALS" } });
        });
    }
    findBenefits() {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.section.findFirst({ where: { type: "BENEFITS" } });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.section.create({ data });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.section.findUnique({ where: { id } });
        });
    }
    update(type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.section.updateMany({
                where: { type },
                data,
            });
        });
    }
    deleteByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.section.deleteMany({ where: { type } });
        });
    }
}
exports.SectionRepository = SectionRepository;
