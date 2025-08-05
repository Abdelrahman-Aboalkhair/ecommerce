"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attribute_factory_1 = require("./attribute.factory");
const router = express_1.default.Router();
const controller = (0, attribute_factory_1.makeAttributeController)();
router.get("/", controller.getAllAttributes);
router.get("/:id", controller.getAttribute);
router.post("/", controller.createAttribute);
router.post("/value", controller.createAttributeValue);
router.post("/assign-category", controller.assignAttributeToCategory);
// router.post("/assign-product", controller.assignAttributeToProduct);
router.delete("/:id", controller.deleteAttribute);
router.delete("/value/:id", controller.deleteAttributeValue);
exports.default = router;
