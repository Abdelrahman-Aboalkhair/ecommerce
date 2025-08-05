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
exports.SectionController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const logs_factory_1 = require("../logs/logs.factory");
const uploadToCloudinary_1 = require("@/shared/utils/uploadToCloudinary");
class SectionController {
    constructor(sectionService) {
        this.sectionService = sectionService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.getAllSections = (0, asyncHandler_1.default)((_req, res) => __awaiter(this, void 0, void 0, function* () {
            const sections = yield this.sectionService.getAllSections();
            (0, sendResponse_1.default)(res, 200, {
                data: { sections },
                message: "Sections fetched successfully",
            });
        }));
        this.findHero = (0, asyncHandler_1.default)((_req, res) => __awaiter(this, void 0, void 0, function* () {
            const hero = yield this.sectionService.findHero();
            (0, sendResponse_1.default)(res, 200, {
                data: { hero },
                message: "Hero fetched successfully",
            });
        }));
        this.findPromo = (0, asyncHandler_1.default)((_req, res) => __awaiter(this, void 0, void 0, function* () {
            const promo = yield this.sectionService.findPromo();
            (0, sendResponse_1.default)(res, 200, {
                data: { promo },
                message: "Promo fetched successfully",
            });
        }));
        this.findArrivals = (0, asyncHandler_1.default)((_req, res) => __awaiter(this, void 0, void 0, function* () {
            const arrivals = yield this.sectionService.findArrivals();
            (0, sendResponse_1.default)(res, 200, {
                data: { arrivals },
                message: "Arrivals fetched successfully",
            });
        }));
        this.findBenefits = (0, asyncHandler_1.default)((_req, res) => __awaiter(this, void 0, void 0, function* () {
            const benefits = yield this.sectionService.findBenefits();
            (0, sendResponse_1.default)(res, 200, {
                data: { benefits },
                message: "Benefits fetched successfully",
            });
        }));
        this.createSection = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { title, description, type, ctaText, icons, link, primaryColor, secondaryColor, } = req.body;
            const files = req.files;
            // Upload images to Cloudinary
            let imageUrls = [];
            if (Array.isArray(files) && files.length > 0) {
                const uploadedImages = yield (0, uploadToCloudinary_1.uploadToCloudinary)(files);
                imageUrls = uploadedImages.map((img) => img.url).filter(Boolean); // Remove any falsy values
            }
            // Prepare section data, excluding undefined values
            const sectionData = {
                title: title || undefined,
                description: description || undefined,
                type: type || undefined,
                ctaText: ctaText || undefined,
                icons: icons || undefined,
                link: link || undefined,
                primaryColor: primaryColor || undefined,
                secondaryColor: secondaryColor || undefined,
                images: imageUrls.length > 0 ? imageUrls : undefined, // Use undefined if no images
            };
            // Remove undefined keys to avoid Prisma validation errors
            Object.keys(sectionData).forEach((key) => sectionData[key] === undefined && delete sectionData[key]);
            const section = yield this.sectionService.createSection(sectionData);
            (0, sendResponse_1.default)(res, 201, {
                data: { section },
                message: "Section created successfully",
            });
            // Log the action
            const start = Date.now();
            const end = Date.now();
            this.logsService.info("Section created", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
                timePeriod: end - start,
            });
        }));
        this.getSectionById = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const section = yield this.sectionService.getSectionById(Number(req.params.id));
            (0, sendResponse_1.default)(res, 200, {
                data: section,
                message: "Section fetched successfully",
            });
        }));
        this.updateSection = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const type = req.params.type;
            const updated = yield this.sectionService.updateSection(type, req.body);
            (0, sendResponse_1.default)(res, 200, {
                data: { updated },
                message: "Section updated successfully",
            });
            const start = Date.now();
            const end = Date.now();
            this.logsService.info("Section updated", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
                timePeriod: end - start,
            });
        }));
        this.deleteSection = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const type = req.params.type;
            yield this.sectionService.deleteSection(type);
            (0, sendResponse_1.default)(res, 200, { message: "Section deleted successfully" });
        }));
    }
}
exports.SectionController = SectionController;
