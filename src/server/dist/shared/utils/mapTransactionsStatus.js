"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Maps a search query to a list of valid transaction statuses (enums)
 * that include the query substring (case-insensitive).
 *
 * This is helpful because enum fields in Prisma can't use `contains`,
 * so we map user input to possible enum values using `.includes()`.
 */
const mapTransactionStatus = (searchQuery) => {
    const query = searchQuery.toLowerCase();
    // These are all the possible enum values for the `status` field
    const validStatuses = [
        "PENDING",
        "PROCESSING",
        "SHIPPED",
        "IN_TRANSIT",
        "DELIVERED",
        "CANCELED",
        "RETURNED",
        "REFUNDED",
    ];
    // Filter enums that match the search query (case-insensitive)
    return validStatuses.filter((status) => status.includes(query));
};
exports.default = mapTransactionStatus;
