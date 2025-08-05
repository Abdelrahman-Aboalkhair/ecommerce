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
const mapTransactionsStatus_1 = __importDefault(require("./mapTransactionsStatus"));
/**
 * Generic search function to query any model in Prisma dynamically.
 *
 * Params:
 * - model: the name of the Prisma model (e.g., "product", "user")
 * - fields: array of field definitions to search by; includes:
 *    - name: field name
 *    - isString: whether this field is a string (can use `contains`) or not
 * - searchQuery: the user's search input
 * - prisma: Prisma client instance
 *
 * Returns:
 * - Array of matching records with only the selected fields and `id`
 */
const searchModel = (model, fields, searchQuery, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma[model].findMany({
        where: {
            OR: fields
                .map(({ name, isString }) => {
                if (isString) {
                    // For string fields, use "contains" with case-insensitive search
                    return {
                        [name]: { contains: searchQuery, mode: "insensitive" },
                    };
                }
                else {
                    // For non-string fields (like enums), define custom handling
                    if (model === "transaction" && name === "status") {
                        const validStatuses = (0, mapTransactionsStatus_1.default)(searchQuery);
                        return {
                            [name]: { in: validStatuses }, // Enum filtering
                        };
                    }
                    return {}; // Skip unsupported non-string fields
                }
            })
                .filter((condition) => Object.keys(condition).length > 0), // Remove empty search objects
        },
        select: Object.assign({ id: true }, fields.reduce((acc, { name }) => {
            acc[name] = true;
            return acc;
        }, {})),
    });
});
exports.default = searchModel;
