"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeReviewController = void 0;
const review_repository_1 = require("./review.repository");
const review_service_1 = require("./review.service");
const review_controller_1 = require("./review.controller");
const makeReviewController = () => {
    const repository = new review_repository_1.ReviewRepository();
    const service = new review_service_1.ReviewService(repository);
    return new review_controller_1.ReviewController(service);
};
exports.makeReviewController = makeReviewController;
