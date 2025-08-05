"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveFromCartDto = exports.UpdateCartItemDto = exports.AddToCartDto = void 0;
const class_validator_1 = require("class-validator");
class AddToCartDto {
}
exports.AddToCartDto = AddToCartDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Product ID is required" }),
    (0, class_validator_1.IsString)({ message: "Product ID must be a string" }),
    __metadata("design:type", String)
], AddToCartDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Quantity is required" }),
    (0, class_validator_1.IsNumber)({}, { message: "Quantity must be a number" }),
    (0, class_validator_1.Min)(1, { message: "Quantity must be at least 1" }),
    __metadata("design:type", Number)
], AddToCartDto.prototype, "quantity", void 0);
class UpdateCartItemDto {
}
exports.UpdateCartItemDto = UpdateCartItemDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Product ID is required" }),
    (0, class_validator_1.IsString)({ message: "Product ID must be a string" }),
    __metadata("design:type", String)
], UpdateCartItemDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Quantity is required" }),
    (0, class_validator_1.IsNumber)({}, { message: "Quantity must be a number" }),
    (0, class_validator_1.Min)(0, { message: "Quantity cannot be negative" }),
    __metadata("design:type", Number)
], UpdateCartItemDto.prototype, "quantity", void 0);
class RemoveFromCartDto {
}
exports.RemoveFromCartDto = RemoveFromCartDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Product ID is required" }),
    (0, class_validator_1.IsString)({ message: "Product ID must be a string" }),
    __metadata("design:type", String)
], RemoveFromCartDto.prototype, "productId", void 0);
