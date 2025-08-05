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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const uploadToCloudinary = (files) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadPromises = files.map((file) => new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader
                .upload_stream({
                resource_type: "image",
                fetch_format: "webp",
                quality: "auto",
                flags: "progressive",
            }, (error, result) => {
                if (error)
                    return reject(error);
                if (!result)
                    return reject(new Error("Upload failed"));
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            })
                .end(file.buffer);
        }));
        const results = yield Promise.allSettled(uploadPromises);
        const successfulUploads = results
            .filter((result) => result.status === "fulfilled")
            .map((result) => result.value);
        return successfulUploads;
    }
    catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return [];
    }
});
exports.uploadToCloudinary = uploadToCloudinary;
