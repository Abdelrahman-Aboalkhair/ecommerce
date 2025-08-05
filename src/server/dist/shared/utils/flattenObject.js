"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = flattenObject;
function flattenObject(obj, prefix = "") {
    return Object.keys(obj).reduce((acc, key) => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === "object" &&
            obj[key] !== null &&
            !Array.isArray(obj[key])) {
            return Object.assign(Object.assign({}, acc), flattenObject(obj[key], newKey));
        }
        else if (Array.isArray(obj[key])) {
            acc[newKey] = JSON.stringify(obj[key]);
        }
        else {
            acc[newKey] = obj[key];
        }
        return acc;
    }, {});
}
