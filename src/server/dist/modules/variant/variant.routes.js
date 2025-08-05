"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const variant_factory_1 = require("./variant.factory");
const protect_1 = __importDefault(require("@/shared/middlewares/protect"));
const router = express_1.default.Router();
const controller = (0, variant_factory_1.makeVariantController)();
router.get("/", controller.getAllVariants);
router.get("/:id", controller.getVariantById);
router.get("/sku/:sku", controller.getVariantBySku);
router.get('/:id/restock-history', controller.getRestockHistory);
router.post("/", controller.createVariant);
router.patch("/:id", controller.updateVariant);
router.post("/:id/restock", protect_1.default, controller.restockVariant);
router.delete("/:id", controller.deleteVariant);
exports.default = router;
